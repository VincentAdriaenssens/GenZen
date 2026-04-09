package fr.but3.genzen.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MissionTodoResponse(
        Long missionId,
        String title,
        String description,
        int tmp,
        boolean validated,
        LocalDateTime completedAt,
        LocalDateTime validatedAt,
        LocalDate rewardAvailableOn,
        int rewardMinutes,
        int rewardRemainingMinutes
) {
}
