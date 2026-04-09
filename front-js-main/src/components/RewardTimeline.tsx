import { Badge } from './Ui';
import EmptyState from './EmptyState';
import type { RewardLog, Tone } from '../types';

interface RewardTimelineProps {
	rewards: RewardLog[];
	emptyTitle: string;
	emptyDescription: string;
	resolveBadgeLabel?: (reward: RewardLog) => string;
	resolveBadgeTone?: (reward: RewardLog) => Tone;
}

export default function RewardTimeline({
	rewards,
	emptyTitle,
	emptyDescription,
	resolveBadgeLabel = (reward) =>
		`${reward.minutes} min ${reward.status === 'scheduled' ? 'restants' : 'consommés'}`,
	resolveBadgeTone = (reward) => (reward.status === 'scheduled' ? 'green' : 'neutral'),
}: RewardTimelineProps) {
	if (!rewards.length) {
		return <EmptyState title={emptyTitle} description={emptyDescription} />;
	}

	return (
		<div className="reward-list">
			{rewards.map((reward) => (
				<div className="reward-row" key={reward.id}>
					<div>
						<strong>{reward.missionTitle}</strong>
						<span>{reward.availableOn}</span>
					</div>
					<Badge tone={resolveBadgeTone(reward)} icon="gift">
						{resolveBadgeLabel(reward)}
					</Badge>
				</div>
			))}
		</div>
	);
}
