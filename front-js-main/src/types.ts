export interface AuthSession {
	id: number;
	email: string;
	parent: boolean;
}

export interface ApiUser extends AuthSession {}

export interface CreateUserPayload {
	email: string;
	mdp: string;
}

export interface ApiMission {
	missionId: number;
	title: string;
	description: string;
	tmp: number;
	validated: boolean;
	completedAt: string | null;
	validatedAt: string | null;
	rewardAvailableOn: string | null;
	rewardMinutes: number;
	rewardRemainingMinutes: number;
}

export interface CreateMissionPayload {
	title: string;
	description: string;
	tmp: number;
	childId?: number;
	parentId?: number;
}

export interface ScreenTimeOverview {
	childId: number;
	tempsMax: number;
	tempsRecompenses: number;
	bonusDisponibleAujourdhui: number;
	totalDisponibleAujourdhui: number;
	tempsConsommeAujourdhui: number;
	tempsRestantAujourdhui: number;
}

export interface ScreenTimeSettingsPayload {
	tempsMax: number;
	tempsRecompenses: number;
}

export interface ConsumeRewardPayload {
	minutes: number;
}

export interface ScreenTimeConsumptionPayload {
	tempsConsommeAujourdhui: number;
}

export type Tone = 'coral' | 'pink' | 'green' | 'blue' | 'neutral';
export type ParentTab = 'dashboard' | 'validations' | 'missions' | 'settings';
export type ChildTab = 'home' | 'missions' | 'progress' | 'lock';
export type MissionCategory = 'Maison' | 'Lecture' | 'Mouvement' | 'Autonomie';
export type MissionStatus = 'available' | 'pending' | 'validated' | 'rejected';
export type RewardStatus = 'scheduled' | 'consumed';
export type IconName =
	| 'spark'
	| 'clock'
	| 'gift'
	| 'tasks'
	| 'shield'
	| 'trend'
	| 'home'
	| 'book'
	| 'walk'
	| 'check'
	| 'settings'
	| 'plus'
	| 'family'
	| 'lock'
	| 'moon'
	| 'heart'
	| 'close';

export interface AppMission {
	id: number;
	title: string;
	description: string;
	estimatedDurationMinutes: number;
	category: MissionCategory;
	status: MissionStatus;
	rewardMinutes: number;
	rewardRemainingMinutes: number;
	effortLabel: string;
	tone: Tone;
	icon: IconName;
	completedAt?: string | null;
	validatedAt?: string | null;
	rewardAvailableOn?: string | null;
	parentNote?: string;
}

export interface RewardLog {
	id: number;
	missionTitle: string;
	minutes: number;
	availableOn: string;
	status: RewardStatus;
}

export interface UsagePoint {
	label: string;
	used: number;
	limit: number;
	earned: number;
}
