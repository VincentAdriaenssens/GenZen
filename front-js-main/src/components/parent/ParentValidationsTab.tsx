import { formatDateLabel } from '../../lib/format';
import type { AppMission } from '../../types';
import EmptyState from '../EmptyState';
import MissionStatusCard from '../MissionStatusCard';
import { ActionButton, SectionCard, SectionHeader } from '../Ui';

interface ParentValidationsTabProps {
	pendingMissions: AppMission[];
	onDecideMission: (missionId: number, decision: 'validate' | 'reject') => void;
}

export default function ParentValidationsTab({
	pendingMissions,
	onDecideMission,
}: ParentValidationsTabProps) {
	return (
		<SectionCard tone="pink">
			<SectionHeader
				title="Validations parent"
				description="Traite les missions terminées par l’enfant et déclenche les bonus du lendemain."
			/>
			{pendingMissions.length ? (
				<div className="card-stack">
					{pendingMissions.map((mission) => (
						<MissionStatusCard
							key={mission.id}
							mission={mission}
							trailing={
								<div className="meta-block">
									<span>
										Terminée: {mission.completedAt ? formatDateLabel(mission.completedAt) : 'Aujourd’hui'}
									</span>
								</div>
							}
							actions={
								<>
									<ActionButton onClick={() => onDecideMission(mission.id, 'validate')}>
										Valider
									</ActionButton>
									<ActionButton
										variant="danger"
										onClick={() => onDecideMission(mission.id, 'reject')}
									>
										Refuser
									</ActionButton>
								</>
							}
						/>
					))}
				</div>
			) : (
				<EmptyState
					title="Aucune mission en attente"
					description="Les validations à traiter apparaîtront ici dès qu’un enfant marque une mission comme terminée."
				/>
			)}
		</SectionCard>
	);
}
