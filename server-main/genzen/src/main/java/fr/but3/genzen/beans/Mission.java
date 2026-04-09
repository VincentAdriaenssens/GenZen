package fr.but3.genzen.beans;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "missions")
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String title;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @Min(1)
    @Column(name = "tmp", nullable = false)
    private int estimatedDurationMinutes;

    @Column(name = "created_by_parent")
    private Long createdByParent;

    @Transient
    public int getTmp() {
        return estimatedDurationMinutes;
    }

    public void setTmp(int tmp) {
        this.estimatedDurationMinutes = tmp;
    }
}
