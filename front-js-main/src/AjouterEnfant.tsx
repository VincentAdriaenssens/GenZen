import type { FormEvent } from 'react';
import { useState } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router';
import AuthShell from './components/AuthShell';
import { ActionButton, Badge, TextField } from './components/Ui';
import { getStoredSession } from './lib/session';
import { addChild } from './services/userService';

export default function AjouterEnfant() {
	const navigate = useNavigate();
	const session = getStoredSession();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	if (!session) {
		return <Navigate to="/auth/login" replace />;
	}

	if (!session.parent) {
		return <Navigate to="/kid" replace />;
	}

	const currentSession = session;

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError('');

		if (!email.trim() || !password.trim()) {
			setError("Renseigne l'email et le mot de passe de l'enfant.");
			return;
		}

		setIsSubmitting(true);
		try {
			await addChild(currentSession.email, { email: email.trim(), mdp: password });
			navigate('/');
		} catch (currentError) {
			const message =
				currentError instanceof Error
					? currentError.message
					: "Impossible d'ajouter l'enfant.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AuthShell
			title="Ajouter un enfant"
			subtitle="Le rattachement utilise directement le parent connecté pour éviter les incohérences côté front."
			footer={
				<p className="auth-footnote">
					Retour au <NavLink to="/">dashboard parent</NavLink>
				</p>
			}
		>
				<form className="form-stack" onSubmit={handleSubmit}>
					<Badge tone="blue" icon="family">
						Parent connecté: {currentSession.email}
					</Badge>
				<TextField
					label="Email de l'enfant"
					type="email"
					value={email}
					onChange={setEmail}
					placeholder="lina@genzen.app"
				/>
				<TextField
					label="Mot de passe"
					type="password"
					value={password}
					onChange={setPassword}
					placeholder="••••••••"
				/>
				{error ? <p className="form-error">{error}</p> : null}
				<ActionButton type="submit">
					{isSubmitting ? 'Ajout...' : 'Ajouter le profil enfant'}
				</ActionButton>
			</form>
		</AuthShell>
	);
}
