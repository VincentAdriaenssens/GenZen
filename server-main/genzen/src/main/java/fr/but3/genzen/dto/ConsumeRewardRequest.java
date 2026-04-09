package fr.but3.genzen.dto;

import jakarta.validation.constraints.Min;

public record ConsumeRewardRequest(
        @Min(1) int minutes
) {
}
