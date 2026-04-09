import type { FormEvent } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import AuthShell from './components/AuthShell';
import { ActionButton, Badge, TextField } from './components/Ui';
import { login } from './services/authService';
import { getDefaultRoute, setStoredSession, toAuthSession } from './lib/session';

export default function Connexion() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('parent.martin@genzen.local');
	const [password, setPassword] = useState('parent123');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError('');

		if (!email.trim() || !password.trim()) {
			setError('Renseigne un email et un mot de passe.');
			return;
		}

		setIsSubmitting(true);
		try {
			const user = await login(email.trim(), password);
			const session = toAuthSession(user);
			setStoredSession(session);
			navigate(getDefaultRoute(session));
		} catch (currentError) {
			const message =
				currentError instanceof Error
					? currentError.message
					: 'Connexion impossible pour le moment.';
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AuthShell
			title="Connexion"
			subtitle="Connexion réelle au backend Spring avec session HTTP et reprise locale de l'utilisateur courant."
			footer={
				<p className="auth-footnote">
					Pas encore de compte ? <NavLink to="/auth/register">Créer un compte</NavLink>
				</p>
			}
		>
			<form className="form-stack" onSubmit={handleSubmit}>
				<Badge tone="blue" icon="shield">
					API branchée sur le backend GenZen
				</Badge>
				<TextField
					label="Email"
					type="email"
					value={email}
					onChange={setEmail}
					placeholder="votre@email.com"
				/>
				<TextField
					label="Mot de passe"
					type="password"
					value={password}
					onChange={setPassword}
					placeholder="••••••••"
				/>
				<p className="auth-footnote">
					Comptes de démonstration backend: `parent.martin@genzen.local` / `parent123` ou `emma@genzen.local` / `enfant123`.
				</p>
				{error ? <p className="form-error">{error}</p> : null}
				<ActionButton type="submit">{isSubmitting ? 'Connexion...' : 'Entrer dans GenZen'}</ActionButton>
			</form>
		</AuthShell>
	);
}
