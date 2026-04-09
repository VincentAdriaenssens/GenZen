import type { AppMission } from '../../types';
import EmptyState from '../EmptyState';
import MissionStatusCard from '../MissionStatusCard';
import { ActionButton, SectionCard, SectionHeader } from '../Ui';

interface ChildMissionsTabProps {
	availableMissions: AppMission[];
	pendingMissions: AppMission[];
	onCompleteMission: (missionId: number) => void;
}

export default function ChildMissionsTab({
	availableMissions,
	pendingMissions,
	onCompleteMission,
}: ChildMissionsTabProps) {
	return (
		<SectionCard tone="blue">
			<SectionHeader
				title="Missions"
				description="Sépare ce qu'il reste à faire de ce qui attend la décision du parent."
			/>
			<div className="card-stack">
				{availableMissions.map((mission) => (
					<MissionStatusCard
						key={mission.id}
						mission={mission}
						actions={
							<ActionButton onClick={() => onCompleteMission(mission.id)}>
								J'ai terminé
							</ActionButton>
						}
					/>
				))}
				{pendingMissions.map((mission) => (
					<MissionStatusCard key={mission.id} mission={mission} />
				))}
				{!availableMissions.length && !pendingMissions.length ? (
					<EmptyState
						title="Aucune mission active"
						description="Les nouvelles missions apparaîtront ici automatiquement."
					/>
				) : null}
			</div>
		</SectionCard>
	);
}
