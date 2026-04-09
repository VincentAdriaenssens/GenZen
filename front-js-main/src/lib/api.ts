const rawApiUrl = import.meta.env.VITE_API_URL?.trim() ?? '';

export const apiBaseUrl = rawApiUrl.replace(/\/$/, '');

export function isApiConfigured() {
	return apiBaseUrl.length > 0;
}

export class ApiError extends Error {
	public readonly status: number;
	public readonly payload?: unknown;

	constructor(status: number, message: string, payload?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.payload = payload;
	}
}

function buildUrl(path: string) {
	if (!isApiConfigured()) {
		throw new Error(
			"VITE_API_URL n'est pas configurée. Ajoute l'URL du backend dans l'environnement du front."
		);
	}

	return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

async function readResponseBody(response: Response) {
	if (response.status === 204) {
		return null;
	}

	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		return response.json();
	}

	const text = await response.text();
	return text ? text : null;
}

function resolveApiErrorMessage(status: number, payload: unknown) {
	if (payload && typeof payload === 'object' && 'error' in payload) {
		const message = payload.error;
		if (typeof message === 'string' && message.trim()) {
			return message;
		}
	}

	return `Erreur API (${status})`;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}) {
	const headers = new Headers(init.headers);
	const body = init.body;

	if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json');
	}

	try {
		const response = await fetch(buildUrl(path), {
			credentials: 'include',
			...init,
			headers,
		});

		const payload = await readResponseBody(response);
		if (!response.ok) {
			throw new ApiError(
				response.status,
				resolveApiErrorMessage(response.status, payload),
				payload
			);
		}

		return payload as T;
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error(
				`Impossible de joindre le backend GenZen (${apiBaseUrl || 'URL absente'}). Vérifie que l'API Spring est démarrée et que VITE_API_URL est correcte.`
			);
		}

		throw error;
	}
}
