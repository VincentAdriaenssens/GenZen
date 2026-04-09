import { apiRequest } from '../lib/api';
import type { ApiMission, CreateMissionPayload } from '../types';

export async function createMission(payload: CreateMissionPayload) {
	return apiRequest(`/api/missions`, {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function getAllMissions(childId: number) {
	return apiRequest<ApiMission[]>(`/api/missions/all/${childId}`);
}

export async function getPendingMissions(childId: number) {
	return apiRequest<ApiMission[]>(`/api/missions/completed/${childId}`);
}

export async function getValidatedMissions(childId: number) {
	return apiRequest<ApiMission[]>(`/api/missions/valided/${childId}`);
}

export async function getRejectedMissions(childId: number) {
	return apiRequest<ApiMission[]>(`/api/missions/rejected/${childId}`);
}

export async function completeMission(childId: number, missionId: number) {
	return apiRequest<ApiMission>(`/api/missions/complete/${childId}/${missionId}`, {
		method: 'POST',
	});
}

export async function validateMission(childId: number, missionId: number) {
	return apiRequest<ApiMission>(`/api/missions/validate/${childId}/${missionId}`, {
		method: 'POST',
	});
}

export async function rejectMission(childId: number, missionId: number) {
	return apiRequest<ApiMission>(`/api/missions/reject/${childId}/${missionId}`, {
		method: 'POST',
	});
}
