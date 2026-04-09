package fr.but3.genzen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.but3.genzen.beans.ScreenTimeSettings;

public interface ScreenTimeSettingsRepository extends JpaRepository<ScreenTimeSettings, Long> {
    Optional<ScreenTimeSettings> findByChildId(Long childId);
}
