package fr.but3.genzen.beans;

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
@Table(name = "parent_de")
public class ParentDe {

    @EmbeddedId
    private ParentDeId id;

    @Column(name = "created_at", nullable = false)
    private java.time.LocalDateTime createdAt;

    public static ParentDe of(Long childId, Long parentId) {
        return ParentDe.builder()
                .id(new ParentDeId(childId, parentId))
                .createdAt(java.time.LocalDateTime.now())
                .build();
    }
}
