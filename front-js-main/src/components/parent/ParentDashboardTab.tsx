import { toHumanName } from '../../lib/format';
import type { RewardLog, ScreenTimeOverview } from '../../types';
import RewardTimeline from '../RewardTimeline';
import { Badge, SectionCard, SectionHeader, StatCard } from '../Ui';

interface ParentDashboardTabProps {
	childEmail: string;
	childrenCount: number;
	pendingCount: number;
	activeMissionCount: number;
	screenTime: ScreenTimeOverview | null;
	rewardLogs: RewardLog[];
}

export default function ParentDashboardTab({
	childEmail,
	childrenCount,
	pendingCount,
	activeMissionCount,
	screenTime,
	rewardLogs,
}: ParentDashboardTabProps) {
	return (
		<div className="screen-stack">
			<SectionCard tone="blue" className="workspace-intro">
				<p className="eyebrow">Espace parent</p>
				<h2>{toHumanName(childEmail)}</h2>
				<p>
					Suivi centralisé des missions, du quota quotidien et des bonus accordés à
					l’enfant sélectionné.
				</p>
				<div className="hero-card__chips">
					<Badge tone="blue" icon="family">
						{childrenCount} enfant{childrenCount > 1 ? 's' : ''} rattaché
						{childrenCount > 1 ? 's' : ''}
					</Badge>
					<Badge tone="pink" icon="tasks">
						{pendingCount} validation{pendingCount > 1 ? 's' : ''} en attente
					</Badge>
					<Badge tone="green" icon="gift">
						{screenTime?.bonusDisponibleAujourdhui ?? 0} min de bonus consommables aujourd’hui
					</Badge>
				</div>
			</SectionCard>

			<div className="stat-grid">
				<StatCard
					label="Quota quotidien"
					value={`${screenTime?.tempsMax ?? 0} min`}
					detail="Paramètre de base renvoyé par le backend."
					tone="blue"
					icon="clock"
				/>
				<StatCard
					label="Bonus par mission"
					value={`${screenTime?.tempsRecompenses ?? 0} min`}
					detail="Valeur appliquée lors de la validation parent."
					tone="green"
					icon="gift"
				/>
				<StatCard
					label="Missions actives"
					value={`${activeMissionCount}`}
					detail="Disponibles ou en attente de validation."
					tone="pink"
					icon="tasks"
				/>
			</div>

			<SectionCard tone="neutral">
				<SectionHeader
					title="Récompenses et historique"
					description="Vue synthétique des bonus générés par les missions validées."
				/>
				<RewardTimeline
					rewards={rewardLogs.slice(0, 4)}
					emptyTitle="Pas encore de récompense"
					emptyDescription="Les bonus apparaîtront ici après les premières validations de mission."
				/>
			</SectionCard>
		</div>
	);
}
