import type { AppMission } from '../../types';
import EmptyState from '../EmptyState';
import MissionStatusCard from '../MissionStatusCard';
import { SectionCard, SectionHeader } from '../Ui';

interface ParentHistorySectionProps {
	validatedMissions: AppMission[];
	rejectedMissions: AppMission[];
}

export default function ParentHistorySection({
	validatedMissions,
	rejectedMissions,
}: ParentHistorySectionProps) {
	if (!validatedMissions.length && !rejectedMissions.length) {
		return null;
	}

	return (
		<SectionCard tone="neutral">
			<SectionHeader
				title="Historique rapide"
				description="Les dernières décisions parent restent visibles quel que soit l’onglet courant."
			/>
			<div className="split-grid">
				<div className="card-stack">
					<h3 className="subsection-title">Validées</h3>
					{validatedMissions.slice(0, 3).map((mission) => (
						<MissionStatusCard key={mission.id} mission={mission} />
					))}
				</div>
				<div className="card-stack">
					<h3 className="subsection-title">Refusées</h3>
					{rejectedMissions.length ? (
						rejectedMissions
							.slice(0, 3)
							.map((mission) => <MissionStatusCard key={mission.id} mission={mission} />)
					) : (
						<EmptyState
							title="Aucun refus récent"
							description="Les missions refusées apparaîtront ici si besoin."
						/>
					)}
				</div>
			</div>
		</SectionCard>
	);
}
