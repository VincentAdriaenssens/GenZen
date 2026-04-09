package fr.but3.genzen.beans;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class MissionCompletionId implements Serializable {
    @Column(name = "iduser")
    private Long idUser;

    @Column(name = "idmissions")
    private Long idMissions;
}
