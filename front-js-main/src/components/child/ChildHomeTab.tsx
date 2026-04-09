import { toHumanName } from '../../lib/format';
import type { AppMission, ScreenTimeOverview } from '../../types';
import EmptyState from '../EmptyState';
import MissionStatusCard from '../MissionStatusCard';
import { ActionButton, Badge, SectionCard, SectionHeader, StatCard } from '../Ui';

interface ChildHomeTabProps {
	email: string;
	screenTime: ScreenTimeOverview | null;
	pendingCount: number;
	availableMissions: AppMission[];
	nextRewardsCount: number;
	onCompleteMission: (missionId: number) => void;
}

export default function ChildHomeTab({
	email,
	screenTime,
	pendingCount,
	availableMissions,
	nextRewardsCount,
	onCompleteMission,
}: ChildHomeTabProps) {
	return (
		<div className="screen-stack">
			<SectionCard tone="green" className="hero-card">
				<p className="eyebrow">Espace enfant</p>
				<h2>Bonjour, {toHumanName(email)}</h2>
				<p>
					Ton quota et tes missions viennent du backend. Les bonus validés restent
					consommables uniquement le jour prévu.
				</p>
				<div className="hero-card__chips">
					<Badge tone="blue" icon="clock">
						Quota du jour: {screenTime?.tempsMax ?? 0} min
					</Badge>
					<Badge tone="green" icon="gift">
						Bonus dispo aujourd’hui: {screenTime?.bonusDisponibleAujourdhui ?? 0} min
					</Badge>
					<Badge tone="pink" icon="tasks">
						{pendingCount} mission{pendingCount > 1 ? 's' : ''} en attente
					</Badge>
				</div>
			</SectionCard>

			<div className="stat-grid">
				<StatCard
					label="Total accordé aujourd'hui"
					value={`${screenTime?.totalDisponibleAujourdhui ?? 0} min`}
					detail="Quota de base + bonus disponible aujourd’hui."
					tone="blue"
					icon="clock"
				/>
				<StatCard
					label="Missions à faire"
					value={`${availableMissions.length}`}
					detail="Commence par celles qui sont encore disponibles."
					tone="pink"
					icon="tasks"
				/>
				<StatCard
					label="Bonus à venir"
					value={`${nextRewardsCount}`}
					detail="Récompenses déjà planifiées pour les prochains jours."
					tone="green"
					icon="gift"
				/>
			</div>

			<SectionCard tone="neutral">
				<SectionHeader
					title="Tes prochaines missions"
					description="Les actions prioritaires du moment."
				/>
				{availableMissions.length ? (
					<div className="card-stack">
						{availableMissions.slice(0, 3).map((mission) => (
							<MissionStatusCard
								key={mission.id}
								mission={mission}
								actions={
									<ActionButton onClick={() => onCompleteMission(mission.id)}>
										Marquer comme terminée
									</ActionButton>
								}
							/>
						))}
					</div>
				) : (
					<EmptyState
						title="Tout est déjà traité"
						description="Reviens plus tard ou demande au parent de créer de nouvelles missions."
					/>
				)}
			</SectionCard>
		</div>
	);
}
