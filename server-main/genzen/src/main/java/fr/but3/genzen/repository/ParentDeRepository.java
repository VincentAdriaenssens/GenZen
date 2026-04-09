package fr.but3.genzen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.but3.genzen.beans.ParentDe;
import fr.but3.genzen.beans.ParentDeId;

public interface ParentDeRepository extends JpaRepository<ParentDe, ParentDeId> {
    List<ParentDe> findByIdIdParent(Long parentId);

    boolean existsByIdIdParentAndIdIdUser(Long parentId, Long childId);
}
