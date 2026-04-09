import type { ScreenTimeOverview, ScreenTimeSettingsPayload } from '../../types';
import { ActionButton, Badge, RangeField, SectionCard, SectionHeader } from '../Ui';

interface ParentSettingsTabProps {
	settingsForm: ScreenTimeSettingsPayload;
	screenTime: ScreenTimeOverview | null;
	onChangeTempsMax: (value: number) => void;
	onChangeTempsRecompenses: (value: number) => void;
	onSave: () => void;
}

export default function ParentSettingsTab({
	settingsForm,
	screenTime,
	onChangeTempsMax,
	onChangeTempsRecompenses,
	onSave,
}: ParentSettingsTabProps) {
	return (
		<div className="split-grid">
			<SectionCard tone="green">
				<SectionHeader
					title="Temps d'écran"
					description="Paramétrage branché sur `POST /api/temps/{childId}`."
				/>
				<div className="form-stack">
					<RangeField
						label="Quota quotidien"
						value={settingsForm.tempsMax}
						onChange={onChangeTempsMax}
						min={0}
						max={240}
						step={5}
						unit="min"
						hint="Quota total de base pour la journée."
					/>
					<RangeField
						label="Récompense par mission validée"
						value={settingsForm.tempsRecompenses}
						onChange={onChangeTempsRecompenses}
						min={0}
						max={60}
						step={5}
						unit="min"
						hint="Utilisée quand le parent valide une mission."
					/>
					<ActionButton onClick={onSave}>Enregistrer les réglages</ActionButton>
				</div>
			</SectionCard>
			<SectionCard tone="neutral">
				<SectionHeader
					title="État courant"
					description="Réponse réelle du backend pour l’enfant sélectionné."
				/>
				<div className="card-stack">
					<div className="reward-row">
						<div>
							<strong>Quota de base</strong>
							<span>{screenTime?.tempsMax ?? 0} min</span>
						</div>
						<Badge tone="blue" icon="clock">
							{screenTime?.totalDisponibleAujourdhui ?? 0} min au total aujourd’hui
						</Badge>
					</div>
					<div className="reward-row">
						<div>
							<strong>Bonus encore disponible</strong>
							<span>Calculé à partir des missions validées non consommées</span>
						</div>
						<Badge tone="green" icon="gift">
							{screenTime?.bonusDisponibleAujourdhui ?? 0} min
						</Badge>
					</div>
				</div>
			</SectionCard>
		</div>
	);
}
