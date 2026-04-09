import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { AppCanvas, Badge, SectionCard } from './Ui';

interface AuthShellProps {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer: ReactNode;
}

export default function AuthShell({
	title,
	subtitle,
	children,
	footer,
}: AuthShellProps) {
	return (
		<AppCanvas>
			<div className="auth-layout">
				<div className="auth-layout__intro">
					<NavLink className="brand-link" to="/">
						GenZen
					</NavLink>
					<Badge icon="shield" tone="blue">
						Contrôle parental pédagogique
					</Badge>
					<h1>{title}</h1>
					<p>{subtitle}</p>
					<SectionCard tone="neutral" className="auth-preview">
						<div className="auth-preview__row">
							<strong>Quota quotidien</strong>
							<span>120 min</span>
						</div>
						<div className="auth-preview__row">
							<strong>Missions bonus</strong>
							<span>activées</span>
						</div>
						<div className="auth-preview__row">
							<strong>Bonus disponible</strong>
							<span>le lendemain uniquement</span>
						</div>
					</SectionCard>
				</div>
				<SectionCard tone="neutral" className="auth-card">
					{children}
					<div className="auth-card__footer">{footer}</div>
				</SectionCard>
			</div>
		</AppCanvas>
	);
}
