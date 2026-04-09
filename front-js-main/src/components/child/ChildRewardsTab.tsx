import type { RewardLog, ScreenTimeOverview } from '../../types';
import RewardTimeline from '../RewardTimeline';
import { ActionButton, Badge, SectionCard, SectionHeader } from '../Ui';

interface ChildRewardsTabProps {
	screenTime: ScreenTimeOverview | null;
	nextRewards: RewardLog[];
	onConsumeReward: (minutes: number) => void;
}

export default function ChildRewardsTab({
	screenTime,
	nextRewards,
	onConsumeReward,
}: ChildRewardsTabProps) {
	const isBlocked = (screenTime?.totalDisponibleAujourdhui ?? 0) === 0;
	const availableBonus = screenTime?.bonusDisponibleAujourdhui ?? 0;

	return (
		<div className="screen-stack">
			<SectionCard tone={isBlocked ? 'coral' : 'green'} className="lock-card">
				<p className="eyebrow">Quota et bonus</p>
				<h2>{isBlocked ? 'Aucun temps accordé aujourd’hui' : 'Bonus et récompenses'}</h2>
				<p>
					Le backend n’expose pas encore la consommation du quota de base minute par minute.
					En revanche, le bonus encore consommable aujourd’hui est réel.
				</p>
				<div className="hero-card__chips">
					<Badge tone="blue" icon="clock">
						Quota de base: {screenTime?.tempsMax ?? 0} min
					</Badge>
					<Badge tone="green" icon="gift">
						Bonus restant: {availableBonus} min
					</Badge>
				</div>
				{availableBonus > 0 ? (
					<div className="mission-card__actions">
						<ActionButton onClick={() => onConsumeReward(Math.min(10, availableBonus))}>
							Consommer 10 min
						</ActionButton>
						<ActionButton variant="secondary" onClick={() => onConsumeReward(availableBonus)}>
							Tout consommer
						</ActionButton>
					</div>
				) : null}
			</SectionCard>

			<SectionCard tone="neutral">
				<SectionHeader
					title="Récompenses planifiées"
					description="Bonus prévus pour demain ou plus tard à partir des validations déjà enregistrées."
				/>
				<RewardTimeline
					rewards={nextRewards}
					emptyTitle="Aucune récompense à venir"
					emptyDescription="Les bonus validés pour demain seront listés ici."
					resolveBadgeLabel={(reward) => `${reward.minutes} min`}
					resolveBadgeTone={() => 'green'}
				/>
			</SectionCard>
		</div>
	);
}
