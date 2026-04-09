import type { AuthSession, ApiUser } from '../types';

const BROWSER_SESSION_KEY = 'genzen.current-session';

export function toAuthSession(user: ApiUser): AuthSession {
	return {
		id: user.id,
		email: user.email,
		parent: user.parent,
	};
}

export function setStoredSession(session: AuthSession) {
	sessionStorage.setItem(BROWSER_SESSION_KEY, JSON.stringify(session));
}

export function getStoredSession(): AuthSession | null {
	const rawSession = sessionStorage.getItem(BROWSER_SESSION_KEY);
	if (!rawSession) {
		return null;
	}

	try {
		return JSON.parse(rawSession) as AuthSession;
	} catch {
		sessionStorage.removeItem(BROWSER_SESSION_KEY);
		return null;
	}
}

export function clearStoredSession() {
	sessionStorage.removeItem(BROWSER_SESSION_KEY);
}

export function getDefaultRoute(session: AuthSession) {
	return session.parent ? '/' : '/kid';
}
