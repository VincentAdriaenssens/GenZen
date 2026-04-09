package fr.but3.genzen.dto;

public record TempOverviewResponse(
        Long childId,
        int tempsMax,
        int tempsRecompenses,
        int bonusDisponibleAujourdhui,
        int totalDisponibleAujourdhui
) {
}
