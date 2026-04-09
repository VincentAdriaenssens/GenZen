import type { FormEvent } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import AuthShell from './components/AuthShell';
import { ActionButton, OptionChipGroup, TextField } from './components/Ui';
import { login, registerParent } from './services/authService';
import { addChild } from './services/userService';
import { getDefaultRoute, setStoredSession, toAuthSession } from './lib/session';

export default function CreerCompte() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'PARENT' | 'ENFANT'>('PARENT');
	const [parentEmail, setParentEmail] = useState('parent.martin@genzen.local');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError('');

		if (!email.trim() || !password.trim()) {
			setError("Renseigne l'email et le mot de passe.");
			return;
		}

		if (role === 'ENFANT' && !parentEmail.trim()) {
			setError("L'email du parent est requis pour rattacher le compte enfant.");
			return;
		}

		setIsSubmitting(true);
		try {
			if (role === 'PARENT') {
				await registerParent({ email: email.trim(), mdp: password });
				const session = toAuthSession(await login(email.trim(), password));
				setStoredSession(session);
				navigate(getDefaultRoute(session));
			} else {
				await addChild(parentEmail.trim(), { email: email.trim(), mdp: password });
				navigate('/auth/login');
			}
		} catch (currentError) {
			const message =
				currentError instanceof Error
					? currentError.message
					: "Erreur lors de l'inscription.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AuthShell
			title="Créer un compte"
			subtitle="Inscription branchée sur les endpoints existants: parent autonome ou enfant rattaché à un parent déjà créé."
			footer={
				<p className="auth-footnote">
					Déjà inscrit ? <NavLink to="/auth/login">Se connecter</NavLink>
				</p>
			}
		>
			<form className="form-stack" onSubmit={handleSubmit}>
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
				<OptionChipGroup
					label="Rôle"
					value={role}
					onChange={setRole}
					options={[
						{ value: 'PARENT', label: 'Parent' },
						{ value: 'ENFANT', label: 'Enfant' },
					]}
				/>
				{role === 'ENFANT' ? (
					<TextField
						label="Email du parent"
						type="email"
						value={parentEmail}
						onChange={setParentEmail}
						placeholder="parent@genzen.local"
					/>
				) : null}
				{error ? <p className="form-error">{error}</p> : null}
				<ActionButton type="submit">
					{isSubmitting ? 'Création...' : role === 'PARENT' ? 'Créer mon compte parent' : 'Créer le compte enfant'}
				</ActionButton>
			</form>
		</AuthShell>
	);
}
