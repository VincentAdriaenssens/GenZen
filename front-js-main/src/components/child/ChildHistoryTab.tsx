import type { AppMission } from '../../types';
import EmptyState from '../EmptyState';
import MissionStatusCard from '../MissionStatusCard';
import { SectionCard, SectionHeader } from '../Ui';

interface ChildHistoryTabProps {
	validatedMissions: AppMission[];
	rejectedMissions: AppMission[];
}

export default function ChildHistoryTab({
	validatedMissions,
	rejectedMissions,
}: ChildHistoryTabProps) {
	return (
		<SectionCard tone="neutral">
			<SectionHeader
				title="Historique"
				description="Missions validées ou refusées par le parent."
			/>
			<div className="card-stack">
				{validatedMissions.map((mission) => (
					<MissionStatusCard key={mission.id} mission={mission} />
				))}
				{rejectedMissions.map((mission) => (
					<MissionStatusCard key={mission.id} mission={mission} />
				))}
				{!validatedMissions.length && !rejectedMissions.length ? (
					<EmptyState
						title="Pas encore d'historique"
						description="Les validations et refus parents apparaîtront ici."
					/>
				) : null}
			</div>
		</SectionCard>
	);
}
