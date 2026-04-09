import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import ChildHistoryTab from './components/child/ChildHistoryTab';
import ChildHomeTab from './components/child/ChildHomeTab';
import ChildMissionsTab from './components/child/ChildMissionsTab';
import ChildRewardsTab from './components/child/ChildRewardsTab';
import RewardTimeline from './components/RewardTimeline';
import { AppCanvas, BottomNav, SectionCard, SectionHeader } from './components/Ui';
import { ApiError } from './lib/api';
import { toHumanName } from './lib/format';
import { buildRewardLogs, decorateMission } from './lib/missions';
import { clearStoredSession, getStoredSession } from './lib/session';
import { logout } from './services/authService';
import { completeMission, getAllMissions } from './services/missionService';
import { consumeReward, getScreenTimeOverview } from './services/screenTimeService';
import type { ApiMission, ChildTab, ScreenTimeOverview } from './types';

export default function EcranEnfant() {
	const navigate = useNavigate();
	const session = getStoredSession();
	const [activeTab, setActiveTab] = useState<ChildTab>('home');
	const [missions, setMissions] = useState<ApiMission[]>([]);
	const [screenTime, setScreenTime] = useState<ScreenTimeOverview | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [feedback, setFeedback] = useState('');

	useEffect(() => {
		if (!session || session.parent) {
			return;
		}

		void loadChildDashboard();
	}, [session?.id, session?.parent]);

	const decoratedMissions = useMemo(() => missions.map(decorateMission), [missions]);
	const availableMissions = decoratedMissions.filter((mission) => mission.status === 'available');
	const pendingMissions = decoratedMissions.filter((mission) => mission.status === 'pending');
	const validatedMissions = decoratedMissions.filter((mission) => mission.status === 'validated');
	const rejectedMissions = decoratedMissions.filter((mission) => mission.status === 'rejected');
	const rewardLogs = buildRewardLogs(missions);
	const nextRewards = rewardLogs.filter((reward) => reward.status === 'scheduled');

	if (!session) {
		return <Navigate to="/auth/login" replace />;
	}

	if (session.parent) {
		return <Navigate to="/" replace />;
	}

	const currentSession = session;

	async function loadChildDashboard() {
		setIsLoading(true);
		setError('');

		try {
			const [nextMissions, nextScreenTime] = await Promise.all([
				getAllMissions(currentSession.id),
				getScreenTimeOverview(currentSession.id).catch((currentError) => {
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
					: "Impossible de charger l'espace enfant."
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleLogout() {
		try {
			await logout();
		} catch {
			// Même en cas d'erreur réseau, la session locale doit être invalidée.
		} finally {
			clearStoredSession();
			navigate('/auth/login');
		}
	}

	async function handleCompleteMission(missionId: number) {
		setFeedback('');
		try {
			await completeMission(currentSession.id, missionId);
			setFeedback('Mission marquée comme terminée. Le parent peut maintenant la valider.');
			await loadChildDashboard();
		} catch (currentError) {
			setFeedback(
				currentError instanceof Error
					? currentError.message
					: "Impossible de terminer la mission."
			);
		}
	}

	async function handleConsumeReward(minutes: number) {
		setFeedback('');
		try {
			const nextScreenTime = await consumeReward(currentSession.id, { minutes });
			setScreenTime(nextScreenTime);
			setFeedback(`${minutes} min de bonus consommés pour aujourd'hui.`);
			await loadChildDashboard();
		} catch (currentError) {
			setFeedback(
				currentError instanceof Error
					? currentError.message
					: 'Consommation du bonus impossible.'
			);
		}
	}

	function renderContent() {
		if (isLoading) {
			return (
				<SectionCard tone="neutral">
					<p className="status-copy">Chargement de tes missions et de ton quota...</p>
				</SectionCard>
			);
		}

		switch (activeTab) {
			case 'home':
				return (
					<ChildHomeTab
						email={currentSession.email}
						screenTime={screenTime}
						pendingCount={pendingMissions.length}
						availableMissions={availableMissions}
						nextRewardsCount={nextRewards.length}
						onCompleteMission={(missionId) => void handleCompleteMission(missionId)}
					/>
				);
			case 'missions':
				return (
					<ChildMissionsTab
						availableMissions={availableMissions}
						pendingMissions={pendingMissions}
						onCompleteMission={(missionId) => void handleCompleteMission(missionId)}
					/>
				);
			case 'progress':
				return (
					<ChildHistoryTab
						validatedMissions={validatedMissions}
						rejectedMissions={rejectedMissions}
					/>
				);
			case 'lock':
				return (
					<ChildRewardsTab
						screenTime={screenTime}
						nextRewards={nextRewards}
						onConsumeReward={(minutes) => void handleConsumeReward(minutes)}
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
						<h1>Espace enfant</h1>
						<p className="status-copy">
							Profil courant: {toHumanName(currentSession.email)}. Toutes les missions et récompenses
							proviennent du backend.
						</p>
					</div>
					<div className="workspace-header__actions">
						<button className="toolbar-link" type="button" onClick={() => void handleLogout()}>
							Déconnexion
						</button>
					</div>
				</header>

				{error ? <p className="form-error">{error}</p> : null}
				{feedback ? <p className="notice-banner">{feedback}</p> : null}
				{renderContent()}

				{rewardLogs.length ? (
					<SectionCard tone="neutral">
						<SectionHeader
							title="Historique des récompenses"
							description="Trace simple des bonus déjà créés côté backend."
						/>
						<RewardTimeline
							rewards={rewardLogs}
							emptyTitle=""
							emptyDescription=""
						/>
					</SectionCard>
				) : null}

				<BottomNav
					value={activeTab}
					onChange={setActiveTab}
					items={[
						{ value: 'home', label: 'Accueil', icon: 'home' },
						{ value: 'missions', label: 'Missions', icon: 'tasks' },
						{ value: 'progress', label: 'Historique', icon: 'trend' },
						{ value: 'lock', label: 'Bonus', icon: 'gift' },
					]}
				/>
			</div>
		</AppCanvas>
	);
}
