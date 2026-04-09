const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
	day: 'numeric',
	month: 'short',
	hour: '2-digit',
	minute: '2-digit',
});

export function formatDateLabel(value: string | null | undefined) {
	if (!value) {
		return 'Non planifié';
	}

	return dateFormatter.format(new Date(value));
}

export function formatDateTimeLabel(value: string | null | undefined) {
	if (!value) {
		return 'Jamais';
	}

	return dateTimeFormatter.format(new Date(value));
}

export function toHumanName(email: string) {
	const localPart = email.split('@')[0] ?? email;
	return localPart
		.split(/[._-]+/)
		.filter(Boolean)
		.map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
		.join(' ');
}
