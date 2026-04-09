package fr.but3.genzen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MissionCreateRequest(
        @NotBlank @Size(max = 120) String title,
        @Size(max = 500) String description,
        @Min(1) int tmp,
        Long childId,
        Long parentId
) {
}
