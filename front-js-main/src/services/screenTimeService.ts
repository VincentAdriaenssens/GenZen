import { apiRequest } from '../lib/api';
import type {
	ConsumeRewardPayload,
	ScreenTimeConsumptionPayload,
	ScreenTimeOverview,
	ScreenTimeSettingsPayload,
} from '../types';

export async function getScreenTimeOverview(childId: number) {
	return apiRequest<ScreenTimeOverview>(`/api/temps/${childId}`);
}

export async function updateScreenTime(childId: number, payload: ScreenTimeSettingsPayload) {
	return apiRequest<ScreenTimeOverview>(`/api/temps/${childId}`, {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function updateConsumedScreenTime(
	childId: number,
	payload: ScreenTimeConsumptionPayload,
) {
	return apiRequest<ScreenTimeOverview>(`/api/temps/${childId}/consommation`, {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function consumeReward(childId: number, payload: ConsumeRewardPayload) {
	return apiRequest<ScreenTimeOverview>(`/api/temps/${childId}/consume`, {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}
