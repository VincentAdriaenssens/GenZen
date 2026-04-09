import type { ReactNode } from 'react';
import Icon from './Icon';
import type { IconName, Tone, UsagePoint } from '../types';

interface AppCanvasProps {
	children: ReactNode;
}

interface SectionCardProps {
	children: ReactNode;
	tone?: Tone;
	className?: string;
}

interface SectionHeaderProps {
	title: string;
	description?: string;
	action?: ReactNode;
}

interface BadgeProps {
	children: ReactNode;
	tone?: Tone;
	icon?: IconName;
}

interface StatCardProps {
	label: string;
	value: string;
	detail: string;
	tone?: Tone;
	icon: IconName;
}

interface ProgressBarProps {
	label: string;
	value: number;
	max: number;
	tone?: Tone;
	hint?: string;
}

interface ActionButtonProps {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
	type?: 'button' | 'submit';
	onClick?: () => void;
}

interface TextFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	type?: 'text' | 'email' | 'password';
}

interface TextAreaFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
}

interface RangeFieldProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	unit: string;
	hint: string;
}

interface OptionChipGroupProps<T extends string> {
	label: string;
	value: T;
	onChange: (value: T) => void;
	options: ReadonlyArray<{ value: T; label: string }>;
}

interface SegmentedControlProps<T extends string> {
	options: ReadonlyArray<{ value: T; label: string; icon?: IconName }>;
	value: T;
	onChange: (value: T) => void;
}

interface BottomNavProps<T extends string> {
	items: ReadonlyArray<{ value: T; label: string; icon: IconName }>;
	value: T;
	onChange: (value: T) => void;
}

interface MiniBarChartProps {
	points: UsagePoint[];
}

export function AppCanvas({ children }: AppCanvasProps) {
	return (
		<div className="app-shell">
			<div className="app-shell__glow app-shell__glow--coral" />
			<div className="app-shell__glow app-shell__glow--blue" />
			<div className="app-shell__glow app-shell__glow--green" />
			<div className="app-canvas">{children}</div>
		</div>
	);
}

export function SectionCard({ children, tone = 'neutral', className = '' }: SectionCardProps) {
	return <section className={`section-card tone-${tone} ${className}`.trim()}>{children}</section>;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
	return (
		<div className="section-header">
			<div>
				<h2>{title}</h2>
				{description ? <p>{description}</p> : null}
			</div>
			{action ? <div className="section-header__action">{action}</div> : null}
		</div>
	);
}

export function Badge({ children, tone = 'neutral', icon }: BadgeProps) {
	return (
		<span className={`badge tone-${tone}`}>
			{icon ? <Icon className="badge__icon" name={icon} /> : null}
			{children}
		</span>
	);
}

export function StatCard({ label, value, detail, tone = 'neutral', icon }: StatCardProps) {
	return (
		<div className={`stat-card tone-${tone}`}>
			<div className="stat-card__icon">
				<Icon name={icon} />
			</div>
			<p className="stat-card__label">{label}</p>
			<strong className="stat-card__value">{value}</strong>
			<p className="stat-card__detail">{detail}</p>
		</div>
	);
}

export function ProgressBar({ label, value, max, tone = 'blue', hint }: ProgressBarProps) {
	const percent = Math.min(100, Math.round((value / max) * 100));

	return (
		<div className="progress-block">
			<div className="progress-block__header">
				<span>{label}</span>
				<strong>{percent}%</strong>
			</div>
			<div className="progress-track">
				<div className={`progress-track__fill tone-${tone}`} style={{ width: `${percent}%` }} />
			</div>
			{hint ? <p className="progress-block__hint">{hint}</p> : null}
		</div>
	);
}

export function ActionButton({
	children,
	variant = 'primary',
	type = 'button',
	onClick,
}: ActionButtonProps) {
	return (
		<button className={`action-button action-button--${variant}`} onClick={onClick} type={type}>
			{children}
		</button>
	);
}

export function TextField({
	label,
	value,
	onChange,
	placeholder,
	type = 'text',
}: TextFieldProps) {
	return (
		<label className="field">
			<span>{label}</span>
			<input
				type={type}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
			/>
		</label>
	);
}

export function TextAreaField({
	label,
	value,
	onChange,
	placeholder,
}: TextAreaFieldProps) {
	return (
		<label className="field">
			<span>{label}</span>
			<textarea
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				rows={4}
			/>
		</label>
	);
}

export function RangeField({
	label,
	value,
	onChange,
	min,
	max,
	step = 5,
	unit,
	hint,
}: RangeFieldProps) {
	return (
		<label className="field field--range">
			<div className="field__split">
				<span>{label}</span>
				<strong>
					{value} {unit}
				</strong>
			</div>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
			/>
			<small>{hint}</small>
		</label>
	);
}

export function OptionChipGroup<T extends string>({
	label,
	value,
	onChange,
	options,
}: OptionChipGroupProps<T>) {
	return (
		<div className="field">
			<span>{label}</span>
			<div className="chip-group">
				{options.map((option) => (
					<button
						type="button"
						key={option.value}
						className={option.value === value ? 'chip chip--active' : 'chip'}
						onClick={() => onChange(option.value)}
					>
						{option.label}
					</button>
				))}
			</div>
		</div>
	);
}

export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
}: SegmentedControlProps<T>) {
	return (
		<div className="segmented-control" role="tablist" aria-label="Changer d'espace">
			{options.map((option) => (
				<button
					type="button"
					key={option.value}
					role="tab"
					aria-selected={option.value === value}
					className={option.value === value ? 'segment segment--active' : 'segment'}
					onClick={() => onChange(option.value)}
				>
					{option.icon ? <Icon className="segment__icon" name={option.icon} /> : null}
					{option.label}
				</button>
			))}
		</div>
	);
}

export function BottomNav<T extends string>({ items, value, onChange }: BottomNavProps<T>) {
	return (
		<nav className="bottom-nav" aria-label="Navigation de l'espace courant">
			{items.map((item) => (
				<button
					type="button"
					key={item.value}
					className={item.value === value ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'}
					onClick={() => onChange(item.value)}
				>
					<Icon className="bottom-nav__icon" name={item.icon} />
					<span>{item.label}</span>
				</button>
			))}
		</nav>
	);
}

export function MiniBarChart({ points }: MiniBarChartProps) {
	return (
		<div className="mini-chart">
			{points.map((point) => {
				const usageHeight = Math.max(18, Math.round((point.used / point.limit) * 100));
				const rewardHeight = Math.max(8, Math.round((point.earned / 40) * 100));
				return (
					<div className="mini-chart__item" key={point.label}>
						<div className="mini-chart__bars">
							<div className="mini-chart__bar mini-chart__bar--reward" style={{ height: `${rewardHeight}%` }} />
							<div className="mini-chart__bar mini-chart__bar--usage" style={{ height: `${usageHeight}%` }} />
						</div>
						<div className="mini-chart__legend">
							<strong>{point.used}m</strong>
							<span>{point.label}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
