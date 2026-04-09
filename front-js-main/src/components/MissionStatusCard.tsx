import type { ReactNode } from 'react';
import { getMissionStatusMeta } from '../lib/missions';
import type { AppMission } from '../types';
import MissionCard from './MissionCard';

interface MissionStatusCardProps {
	mission: AppMission;
	trailing?: ReactNode;
	actions?: ReactNode;
}

export default function MissionStatusCard({
	mission,
	trailing,
	actions,
}: MissionStatusCardProps) {
	const statusMeta = getMissionStatusMeta(mission.status);

	return (
		<MissionCard
			mission={mission}
			statusLabel={statusMeta.label}
			statusTone={statusMeta.tone}
			trailing={trailing}
			actions={actions}
		/>
	);
}
