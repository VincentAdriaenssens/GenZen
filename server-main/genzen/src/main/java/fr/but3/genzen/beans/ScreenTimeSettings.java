package fr.but3.genzen.beans;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "temp")
public class ScreenTimeSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "iduser", nullable = false, unique = true)
    private Long childId;

    @Min(0)
    @Column(name = "temps_max", nullable = false)
    private int dailyLimitMinutes;

    @Min(0)
    @Column(name = "temps_recompenses", nullable = false)
    private int rewardMinutesPerMission;
}
