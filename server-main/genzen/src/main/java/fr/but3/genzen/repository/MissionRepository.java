package fr.but3.genzen.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.but3.genzen.beans.Mission;

public interface MissionRepository extends JpaRepository<Mission, Long> {
}
