import type { AppMission } from '../../types';
import EmptyState from '../EmptyState';
import MissionStatusCard from '../MissionStatusCard';
import {
	ActionButton,
	RangeField,
	SectionCard,
	SectionHeader,
	TextAreaField,
	TextField,
} from '../Ui';

interface ParentMissionsTabProps {
	createTitle: string;
	createDescription: string;
	createDuration: number;
	onChangeTitle: (value: string) => void;
	onChangeDescription: (value: string) => void;
	onChangeDuration: (value: number) => void;
	onCreateMission: () => void;
	missions: AppMission[];
}

export default function ParentMissionsTab({
	createTitle,
	createDescription,
	createDuration,
	onChangeTitle,
	onChangeDescription,
	onChangeDuration,
	onCreateMission,
	missions,
}: ParentMissionsTabProps) {
	return (
		<div className="split-grid">
			<SectionCard tone="blue">
				<SectionHeader
					title="Créer une mission"
					description="Création directement branchée sur `POST /api/missions`."
				/>
				<div className="form-stack">
					<TextField
						label="Titre"
						value={createTitle}
						onChange={onChangeTitle}
						placeholder="Ranger la chambre"
					/>
					<TextAreaField
						label="Description"
						value={createDescription}
						onChange={onChangeDescription}
						placeholder="Consigne courte et compréhensible pour l'enfant."
					/>
					<RangeField
						label="Durée estimée"
						value={createDuration}
						onChange={onChangeDuration}
						min={5}
						max={60}
						step={5}
						unit="min"
						hint="Utilisée aussi comme repli pour la récompense si aucun réglage n'existe."
					/>
					<ActionButton onClick={onCreateMission}>Créer et assigner</ActionButton>
				</div>
			</SectionCard>
			<SectionCard tone="neutral">
				<SectionHeader
					title="Catalogue de missions"
					description="Vue consolidée des missions disponibles, validées ou refusées pour l’enfant courant."
				/>
				{missions.length ? (
					<div className="card-stack">
						{missions.map((mission) => (
							<MissionStatusCard key={mission.id} mission={mission} />
						))}
					</div>
				) : (
					<EmptyState
						title="Aucune mission"
						description="Crée une première mission pour commencer le suivi."
					/>
				)}
			</SectionCard>
		</div>
	);
}
