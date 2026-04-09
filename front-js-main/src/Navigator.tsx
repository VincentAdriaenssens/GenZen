import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import Accueil from './Accueil';
import AjouterEnfant from './AjouterEnfant';
import Connexion from './Connexion';
import CreerCompte from './CreerCompte';
import EcranEnfant from './EcranEnfant';
import { getDefaultRoute, getStoredSession } from './lib/session';

function RequireAuth({ children }: { children: ReactElement }) {
	const session = getStoredSession();
	if (!session) {
		return <Navigate to="/auth/login" replace />;
	}

	return children;
}

function AuthLandingRedirect() {
	const session = getStoredSession();
	return <Navigate to={session ? getDefaultRoute(session) : '/auth/login'} replace />;
}

export default function Navigator() {
	return (
		<Routes>
			<Route path="/" element={<RequireAuth><Accueil /></RequireAuth>} />
			<Route path="/kid" element={<RequireAuth><EcranEnfant /></RequireAuth>} />
			<Route path="/add/kid" element={<RequireAuth><AjouterEnfant /></RequireAuth>} />
			<Route path="/auth/login" element={<Connexion />} />
			<Route path="/auth/register" element={<CreerCompte />} />
			<Route path="*" element={<AuthLandingRedirect />} />
		</Routes>
	);
}
