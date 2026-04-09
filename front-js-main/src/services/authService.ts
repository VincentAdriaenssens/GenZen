import { apiRequest } from '../lib/api';
import type { ApiUser, CreateUserPayload } from '../types';

export async function login(email: string, mdp: string) {
	return apiRequest<ApiUser>('/api/users/login', {
		method: 'POST',
		body: JSON.stringify({ email, mdp }),
	});
}

export async function registerParent(payload: CreateUserPayload) {
	return apiRequest<ApiUser>('/api/users/register/parent', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function getCurrentUser() {
	return apiRequest<ApiUser | null>('/api/users/me');
}

export async function logout() {
	return apiRequest<void>('/api/users/logout');
}
