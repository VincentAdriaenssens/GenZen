package fr.but3.genzen.dto;

import jakarta.validation.constraints.Min;

public record TempSettingsRequest(
        @Min(0) int tempsMax,
        @Min(0) int tempsRecompenses
) {
}
