import { toHumanName } from '../../lib/format';
import type { ApiUser } from '../../types';
import EmptyState from '../EmptyState';

interface ParentChildSelectorProps {
	children: ApiUser[];
	loading: boolean;
	selectedChildId: number | null;
	onSelectChild: (childId: number) => void;
}

export default function ParentChildSelector({
	children,
	loading,
	selectedChildId,
	onSelectChild,
}: ParentChildSelectorProps) {
	if (loading) {
		return <p className="status-copy">Chargement des profils enfants...</p>;
	}

	if (!children.length) {
		return (
			<EmptyState
				title="Aucun enfant rattaché"
				description="Ajoute un premier profil enfant pour créer des missions et piloter son temps d’écran."
			/>
		);
	}

	return (
		<div className="children-selector">
			{children.map((child) => (
				<button
					type="button"
					key={child.id}
					className={
						child.id === selectedChildId
							? 'chip chip--active children-selector__button'
							: 'chip children-selector__button'
					}
					onClick={() => onSelectChild(child.id)}
				>
					{toHumanName(child.email)}
				</button>
			))}
		</div>
	);
}
