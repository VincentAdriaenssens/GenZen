import { formatDateLabel, formatDateTimeLabel } from './format';
import type {
	ApiMission,
	AppMission,
	IconName,
	MissionCategory,
	MissionStatus,
	RewardLog,
	Tone,
} from '../types';

interface MissionPreset {
	category: MissionCategory;
	tone: Tone;
	icon: IconName;
	effortLabel: string;
}

const defaultMissionPreset: MissionPreset = {
	category: 'Autonomie',
	tone: 'blue',
	icon: 'spark',
	effortLabel: 'Routine',
};

function getMissionPreset(title: string, description: string): MissionPreset {
	const content = `${title} ${description}`.toLowerCase();

	if (/(lecture|livre|lire|chapitre)/.test(content)) {
		return {
			category: 'Lecture',
			tone: 'pink',
			icon: 'book',
			effortLabel: 'Calme',
		};
	}

	if (/(marche|courir|sport|sortie|bouger)/.test(content)) {
		return {
			category: 'Mouvement',
			tone: 'green',
			icon: 'walk',
			effortLabel: 'Énergie',
		};
	}

	if (/(ranger|table|cuisine|chambre|maison|aspirer)/.test(content)) {
		return {
			category: 'Maison',
			tone: 'coral',
			icon: 'home',
			effortLabel: 'Coup de main',
		};
	}

	return defaultMissionPreset;
}

export function getMissionStatus(mission: ApiMission): MissionStatus {
	if (mission.validated) {
		return 'validated';
	}

	if (mission.validatedAt) {
		return 'rejected';
	}

	if (mission.completedAt) {
		return 'pending';
	}

	return 'available';
}

export function getMissionStatusMeta(status: MissionStatus) {
	switch (status) {
		case 'available':
			return { label: 'À faire', tone: 'blue' as Tone };
		case 'pending':
			return { label: 'En attente', tone: 'pink' as Tone };
		case 'validated':
			return { label: 'Validée', tone: 'green' as Tone };
		case 'rejected':
			return { label: 'Refusée', tone: 'coral' as Tone };
	}
}

function buildParentNote(mission: ApiMission, status: MissionStatus) {
	switch (status) {
		case 'available':
			return `Mission disponible. Récompense prévue: ${mission.rewardMinutes || mission.tmp} min.`;
		case 'pending':
			return `Terminée le ${formatDateTimeLabel(mission.completedAt)} et en attente de validation parent.`;
		case 'validated':
			return `Validée le ${formatDateTimeLabel(mission.validatedAt)}. Bonus disponible le ${formatDateLabel(mission.rewardAvailableOn)}.`;
		case 'rejected':
			return `Refusée le ${formatDateTimeLabel(mission.validatedAt)}. L'enfant peut la refaire.`;
	}
}

export function decorateMission(mission: ApiMission): AppMission {
	const status = getMissionStatus(mission);
	const preset = getMissionPreset(mission.title, mission.description);

	return {
		id: mission.missionId,
		title: mission.title,
		description: mission.description,
		estimatedDurationMinutes: mission.tmp,
		category: preset.category,
		status,
		rewardMinutes: mission.rewardMinutes || mission.tmp,
		rewardRemainingMinutes: mission.rewardRemainingMinutes,
		effortLabel: preset.effortLabel,
		tone: preset.tone,
		icon: preset.icon,
		completedAt: mission.completedAt,
		validatedAt: mission.validatedAt,
		rewardAvailableOn: mission.rewardAvailableOn,
		parentNote: buildParentNote(mission, status),
	};
}

export function buildRewardLogs(missions: ApiMission[]) {
	return missions
		.filter((mission) => mission.rewardAvailableOn && mission.rewardMinutes > 0)
		.sort((left, right) =>
			(left.rewardAvailableOn ?? '').localeCompare(right.rewardAvailableOn ?? '')
		)
		.map(
			(mission): RewardLog => ({
				id: mission.missionId,
				missionTitle: mission.title,
				minutes: mission.rewardRemainingMinutes,
				availableOn: formatDateLabel(mission.rewardAvailableOn),
				status: mission.rewardRemainingMinutes > 0 ? 'scheduled' : 'consumed',
			})
		);
}
