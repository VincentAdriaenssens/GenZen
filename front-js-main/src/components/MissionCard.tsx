import type { ReactNode } from 'react';
import Icon from './Icon';
import { Badge } from './Ui';
import type { AppMission, Tone } from '../types';

interface MissionCardProps {
	mission: AppMission;
	statusLabel: string;
	statusTone: Tone;
	trailing?: ReactNode;
	actions?: ReactNode;
}

export default function MissionCard({
	mission,
	statusLabel,
	statusTone,
	trailing,
	actions,
}: MissionCardProps) {
	return (
		<article className={`mission-card tone-${mission.tone}`}>
			<div className="mission-card__header">
				<div className="mission-card__icon">
					<Icon name={mission.icon} />
				</div>
				<div className="mission-card__copy">
					<div className="mission-card__title-row">
						<h3>{mission.title}</h3>
						<Badge tone={statusTone}>{statusLabel}</Badge>
					</div>
					<p>{mission.description}</p>
				</div>
			</div>
			<div className="mission-card__meta">
				<span>{mission.category}</span>
				<span>{mission.estimatedDurationMinutes} min</span>
				<span>+{mission.rewardMinutes} min demain</span>
				<span>{mission.effortLabel}</span>
			</div>
			{mission.parentNote ? <p className="mission-card__note">{mission.parentNote}</p> : null}
			{trailing ? <div className="mission-card__trailing">{trailing}</div> : null}
			{actions ? <div className="mission-card__actions">{actions}</div> : null}
		</article>
	);
}
