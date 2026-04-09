package fr.but3.genzen.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import fr.but3.genzen.beans.MissionCompletion;
import fr.but3.genzen.beans.MissionCompletionId;

public interface MissionCompletionRepository extends JpaRepository<MissionCompletion, MissionCompletionId> {
    List<MissionCompletion> findByIdIdUser(Long childId);

    @Query("""
            select coalesce(sum(r.rewardMinutes - r.rewardConsumedMinutes), 0)
            from MissionCompletion r
            where r.id.idUser = :childId
              and r.valide = true
              and r.rewardAvailableOn is not null
              and r.rewardAvailableOn <= :today
              and r.rewardConsumedMinutes < r.rewardMinutes
            """)
    int computeAvailableRewardMinutes(@Param("childId") Long childId, @Param("today") LocalDate today);

    @Query("""
            select r
            from MissionCompletion r
            where r.id.idUser = :childId
              and r.valide = true
              and r.rewardAvailableOn is not null
              and r.rewardAvailableOn <= :today
              and r.rewardConsumedMinutes < r.rewardMinutes
            order by r.rewardAvailableOn asc, r.validatedAt asc
            """)
    List<MissionCompletion> findConsumableRewards(@Param("childId") Long childId, @Param("today") LocalDate today);
}
