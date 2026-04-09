package fr.but3.genzen.beans;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "realise")
public class MissionCompletion {

    @EmbeddedId
    private MissionCompletionId id;

    @Column(nullable = false)
    private boolean valide;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

    @Column(name = "reward_available_on")
    private LocalDate rewardAvailableOn;

    @Column(name = "reward_minutes", nullable = false)
    private int rewardMinutes;

    @Column(name = "reward_consumed_minutes", nullable = false)
    private int rewardConsumedMinutes;

    public int remainingRewardMinutes() {
        return Math.max(0, rewardMinutes - rewardConsumedMinutes);
    }
}
