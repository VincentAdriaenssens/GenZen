import { useEffect, useMemo, useState } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router';
import EmptyState from './components/EmptyState';
import ParentDashboardTab from './components/parent/ParentDashboardTab';
import ParentChildSelector from './components/parent/ParentChildSelector';
import ParentHistorySection from './components/parent/ParentHistorySection';
import ParentMissionsTab from './components/parent/ParentMissionsTab';
import ParentSettingsTab from './components/parent/ParentSettingsTab';
import ParentValidationsTab from './components/parent/ParentValidationsTab';
import { AppCanvas, SectionCard, SectionHeader, SegmentedControl } from './components/Ui';
import { ApiError } from './lib/api';
import { buildRewardLogs, decorateMission } from './lib/missions';
import { clearStoredSession, getStoredSession } from './lib/session';
import { logout } from './services/authService';
import {
	createMission,
	getAllMissions,
	rejectMission,
	validateMission,
} from './services/missionService';
import { getScreenTimeOverview, updateScreenTime } from './services/screenTimeService';
import { getChildren } from './services/userService';
import type {
	ApiMission,
	ApiUser,
	ParentTab,
	ScreenTimeOverview,
	ScreenTimeSettingsPayload,
} from './types';

const defaultSettingsForm: ScreenTimeSettingsPayload = {
	tempsMax: 90,
	tempsRecompenses: 20,
};

export default function Accueil() {
	const navigate = useNavigate();
	const session = getStoredSession();
	const [activeTab, setActiveTab] = useState<ParentTab>('dashboard');
	const [children, setChildren] = useState<ApiUser[]>([]);
	const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
	const [missions, setMissions] = useState<ApiMission[]>([]);
	const [screenTime, setScreenTime] = useState<ScreenTimeOverview | null>(null);
	const [loadingChildren, setLoadingChildren] = useState(true);
	const [loadingWorkspace, setLoadingWorkspace] = useState(false);
	const [error, setError] = useState('');
	const [feedback, setFeedback] = useState('');
	const [createTitle, setCreateTitle] = useState('');
	const [createDescription, setCreateDescription] = useState('');
	const [createDuration, setCreateDuration] = useState(20);
	const [settingsForm, setSettingsForm] = useState(defaultSettingsForm);

	useEffect(() => {
		if (!session?.parent) {
			return;
		}

		void loadChildren();
	}, [session?.id, session?.parent]);

	useEffect(() => {
		if (selectedChildId === null) {
			setMissions([]);
			setScreenTime(null);
			return;
		}

		void loadChildWorkspace(selectedChildId);
	}, [selectedChildId]);

	useEffect(() => {
		if (!screenTime) {
			setSettingsForm(defaultSettingsForm);
			return;
		}

		setSettingsForm({
			tempsMax: screenTime.tempsMax,
			tempsRecompenses: screenTime.tempsRecompenses,
		});
	}, [screenTime]);

	const selectedChild = useMemo(
		() => children.find((child) => child.id === selectedChildId) ?? null,
		[children, selectedChildId]
	);
	const decoratedMissions = useMemo(() => missions.map(decorateMission), [missions]);
	const pendingMissions = decoratedMissions.filter((mission) => mission.status === 'pending');
	const validatedMissions = decoratedMissions.filter((mission) => mission.status === 'validated');
	const rejectedMissions = decoratedMissions.filter((mission) => mission.status === 'rejected');
	const availableMissions = decoratedMissions.filter((mission) => mission.status === 'available');
	const rewardLogs = buildRewardLogs(missions);

	if (!session) {
		return <Navigate to="/auth/login" replace />;
	}

	if (!session.parent) {
		return <Navigate to="/kid" replace />;
	}

	const currentSession = session;

	async function loadChildren() {
		setLoadingChildren(true);
		setError('');

		try {
			const nextChildren = await getChildren(currentSession.id);
			setChildren(nextChildren);
			setSelectedChildId((currentChildId) => {
				if (currentChildId && nextChildren.some((child) => child.id === currentChildId)) {
					return currentChildId;
				}

				return nextChildren[0]?.id ?? null;
			});
		} catch (currentError) {
			setError(
				currentError instanceof Error
					? currentError.message
					: "Impossible de charger les enfants."
			);
		} finally {
			setLoadingChildren(false);
		}
	}

	async function loadChildWorkspace(childId: number) {
		setLoadingWorkspace(true);
		setError('');

		try {
			const [nextMissions, nextScreenTime] = await Promise.all([
				getAllMissions(childId),
				getScreenTimeOverview(childId).catch((currentError) => {
					if (currentError instanceof ApiError && currentError.status === 404) {
						return null;
					}

					throw currentError;
				}),
			]);
			setMissions(nextMissions);
			setScreenTime(nextScreenTime);
		} catch (currentError) {
			setError(
				currentError instanceof Error
					? currentError.message
					: "Impossible de charger les données de l'enfant."
			);
		} finally {
			setLoadingWorkspace(false);
		}
	}

	async function handleLogout() {
		try {
			await logout();
		} catch {
			// La session locale doit être nettoyée même si le backend n'est plus joignable.
		} finally {
			clearStoredSession();
			navigate('/auth/login');
		}
	}

	async function handleCreateMission() {
		if (!selectedChildId) {
			setFeedback("Sélectionne d'abord un enfant.");
			return;
		}

		if (!createTitle.trim()) {
			setFeedback('Le titre de mission est obligatoire.');
			return;
		}

		setFeedback('');
		try {
			await createMission({
				title: createTitle.trim(),
				description: createDescription.trim(),
				tmp: createDuration,
				childId: selectedChildId,
				parentId: currentSession.id,
			});
			setCreateTitle('');
			setCreateDescription('');
			setCreateDuration(20);
			setFeedback('Mission créée et assignée à l’enfant.');
			await loadChildWorkspace(selectedChildId);
		} catch (currentError) {
			setFeedback(
				currentError instanceof Error
					? currentError.message
					: 'Création de mission impossible.'
			);
		}
	}

	async function handleMissionDecision(missionId: number, decision: 'validate' | 'reject') {
		if (!selectedChildId) {
			return;
		}

		setFeedback('');
		try {
			if (decision === 'validate') {
				await validateMission(selectedChildId, missionId);
				setFeedback('Mission validée.');
			} else {
				await rejectMission(selectedChildId, missionId);
				setFeedback('Mission refusée.');
			}
			await loadChildWorkspace(selectedChildId);
		} catch (currentError) {
			setFeedback(
				currentError instanceof Error
					? currentError.message
					: "Impossible d'enregistrer la décision."
			);
		}
	}

	async function handleSaveSettings() {
		if (!selectedChildId) {
			setFeedback("Sélectionne d'abord un enfant.");
			return;
		}

		setFeedback('');
		try {
			const updatedOverview = await updateScreenTime(selectedChildId, settingsForm);
			setScreenTime(updatedOverview);
			setFeedback("Paramètres de temps d'écran enregistrés.");
		} catch (currentError) {
			setFeedback(
				currentError instanceof Error
					? currentError.message
					: 'Sauvegarde du temps écran impossible.'
			);
		}
	}

	function renderWorkspace() {
		if (!selectedChild) {
			return (
				<SectionCard tone="neutral">
					<EmptyState
						title="Sélectionne un enfant"
						description="Le dashboard parent se remplit automatiquement dès qu’un profil est disponible."
					/>
				</SectionCard>
			);
		}

		if (loadingWorkspace) {
			return (
				<SectionCard tone="neutral">
					<p className="status-copy">Chargement des missions, validations et paramètres...</p>
				</SectionCard>
			);
		}

		switch (activeTab) {
			case 'dashboard':
				return (
					<ParentDashboardTab
						childEmail={selectedChild.email}
						childrenCount={children.length}
						pendingCount={pendingMissions.length}
						activeMissionCount={availableMissions.length + pendingMissions.length}
						screenTime={screenTime}
						rewardLogs={rewardLogs}
					/>
				);
			case 'validations':
				return (
					<ParentValidationsTab
						pendingMissions={pendingMissions}
						onDecideMission={(missionId, decision) =>
							void handleMissionDecision(missionId, decision)
						}
					/>
				);
			case 'missions':
				return (
					<ParentMissionsTab
						createTitle={createTitle}
						createDescription={createDescription}
						createDuration={createDuration}
						onChangeTitle={setCreateTitle}
						onChangeDescription={setCreateDescription}
						onChangeDuration={setCreateDuration}
						onCreateMission={() => void handleCreateMission()}
						missions={decoratedMissions}
					/>
				);
			case 'settings':
				return (
					<ParentSettingsTab
						settingsForm={settingsForm}
						screenTime={screenTime}
						onChangeTempsMax={(tempsMax) =>
							setSettingsForm((currentForm) => ({ ...currentForm, tempsMax }))
						}
						onChangeTempsRecompenses={(tempsRecompenses) =>
							setSettingsForm((currentForm) => ({
								...currentForm,
								tempsRecompenses,
							}))
						}
						onSave={() => void handleSaveSettings()}
					/>
				);
		}
	}

	return (
		<AppCanvas>
			<div className="workspace">
				<header className="workspace-header">
					<div>
						<p className="eyebrow">GenZen</p>
						<h1>Dashboard parent</h1>
						<p className="status-copy">
							Connecté comme {currentSession.email}. Le front consomme maintenant les endpoints réels du backend.
						</p>
					</div>
					<div className="workspace-header__actions">
						<NavLink className="toolbar-link" to="/add/kid">
							Ajouter un enfant
						</NavLink>
						<button className="toolbar-link" type="button" onClick={() => void handleLogout()}>
							Déconnexion
						</button>
					</div>
				</header>

				<SectionCard tone="neutral">
					<SectionHeader
						title="Enfants rattachés"
						description="Sélectionne un profil pour charger ses missions, validations et paramètres."
					/>
					<ParentChildSelector
						children={children}
						loading={loadingChildren}
						selectedChildId={selectedChildId}
						onSelectChild={setSelectedChildId}
					/>
				</SectionCard>

				<SegmentedControl
					value={activeTab}
					onChange={setActiveTab}
					options={[
						{ value: 'dashboard', label: 'Vue globale', icon: 'trend' },
						{ value: 'validations', label: 'Validations', icon: 'check' },
						{ value: 'missions', label: 'Missions', icon: 'tasks' },
						{ value: 'settings', label: 'Réglages', icon: 'settings' },
					]}
				/>

				{error ? <p className="form-error">{error}</p> : null}
				{feedback ? <p className="notice-banner">{feedback}</p> : null}
				{renderWorkspace()}

				<ParentHistorySection
					validatedMissions={validatedMissions}
					rejectedMissions={rejectedMissions}
				/>
			</div>
		</AppCanvas>
	);
}
