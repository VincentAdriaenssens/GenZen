import { apiRequest } from '../lib/api';
import type { ApiUser, CreateUserPayload } from '../types';

export async function addChild(parentEmail: string, payload: CreateUserPayload) {
	return apiRequest<ApiUser>(`/api/users/${encodeURIComponent(parentEmail)}/addChild`, {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function getChildren(parentId: number) {
	return apiRequest<ApiUser[]>(`/api/users/${parentId}/children`);
}

export async function getUser(userId: number) {
	return apiRequest<ApiUser>(`/api/users/${userId}`);
}
