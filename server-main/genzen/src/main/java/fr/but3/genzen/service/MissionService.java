package fr.but3.genzen.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import fr.but3.genzen.beans.Mission;
import fr.but3.genzen.beans.MissionCompletion;
import fr.but3.genzen.beans.MissionCompletionId;
import fr.but3.genzen.beans.ScreenTimeSettings;
import fr.but3.genzen.dto.MissionCreateRequest;
import fr.but3.genzen.dto.MissionTodoResponse;
import fr.but3.genzen.repository.MissionCompletionRepository;
import fr.but3.genzen.repository.MissionRepository;
import fr.but3.genzen.repository.ScreenTimeSettingsRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;
    private final MissionCompletionRepository missionCompletionRepository;
    private final ScreenTimeSettingsRepository screenTimeSettingsRepository;
    private final UserService userService;

    @Transactional
    public Mission createMission(MissionCreateRequest request) {
        if (request.parentId() != null) {
            var parent = userService.getUser(request.parentId());
            if (!parent.isAdmin()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul un parent peut créer une mission");
            }
        }

        Mission mission = Mission.builder()
                .title(request.title())
                .description(request.description())
                .estimatedDurationMinutes(request.tmp())
                .createdByParent(request.parentId())
                .build();

        Mission saved = missionRepository.save(mission);

        if (request.childId() != null) {
            userService.getUser(request.childId());
            if (request.parentId() != null) {
                userService.ensureParentChildRelation(request.parentId(), request.childId());
            }
            missionCompletionRepository.save(MissionCompletion.builder()
                    .id(new MissionCompletionId(request.childId(), saved.getId()))
                    .valide(false)
                    .rewardMinutes(0)
                    .rewardConsumedMinutes(0)
                    .build());
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<MissionTodoResponse> getMissionsToDo(Long childId) {
        userService.getUser(childId);

        List<MissionCompletion> childCompletions = missionCompletionRepository.findByIdIdUser(childId);
        Map<Long, MissionCompletion> byMissionId = new HashMap<>();
        for (MissionCompletion completion : childCompletions) {
            byMissionId.put(completion.getId().getIdMissions(), completion);
        }

        return missionRepository.findAll().stream()
                .map(mission -> toTodoResponse(mission, byMissionId.get(mission.getId())))
                .filter(dto -> !dto.validated())
                .toList();
    }

    @Transactional
    public MissionTodoResponse completeMission(Long childId, Long missionId) {
        userService.getUser(childId);
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mission introuvable"));

        MissionCompletion completion = missionCompletionRepository.findById(new MissionCompletionId(childId, missionId))
                .orElse(MissionCompletion.builder()
                        .id(new MissionCompletionId(childId, missionId))
                        .valide(false)
                        .rewardMinutes(0)
                        .rewardConsumedMinutes(0)
                        .build());

        completion.setCompletedAt(LocalDateTime.now());
        MissionCompletion saved = missionCompletionRepository.save(completion);
        return toTodoResponse(mission, saved);
    }

    @Transactional
    public MissionTodoResponse validateMission(Long childId, Long missionId) {
        userService.getUser(childId);
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mission introuvable"));

        MissionCompletion completion = missionCompletionRepository.findById(new MissionCompletionId(childId, missionId))
                .orElse(MissionCompletion.builder()
                        .id(new MissionCompletionId(childId, missionId))
                        .rewardMinutes(0)
                        .rewardConsumedMinutes(0)
                        .build());

        int rewardMinutes = screenTimeSettingsRepository.findByChildId(childId)
                .map(ScreenTimeSettings::getRewardMinutesPerMission)
                .orElse(mission.getEstimatedDurationMinutes());

        completion.setValide(true);
        if (completion.getCompletedAt() == null) {
            completion.setCompletedAt(LocalDateTime.now());
        }
        completion.setValidatedAt(LocalDateTime.now());
        completion.setRewardAvailableOn(LocalDate.now().plusDays(1));
        completion.setRewardMinutes(rewardMinutes);
        if (completion.getRewardConsumedMinutes() > rewardMinutes) {
            completion.setRewardConsumedMinutes(rewardMinutes);
        }

        MissionCompletion saved = missionCompletionRepository.save(completion);
        return toTodoResponse(mission, saved);
    }

    @Transactional
    public MissionTodoResponse rejectMission(Long childId, Long missionId) {
        userService.getUser(childId);
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mission introuvable"));

        MissionCompletion completion = missionCompletionRepository.findById(new MissionCompletionId(childId, missionId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mission non soumise"));

        completion.setValide(false);
        completion.setValidatedAt(LocalDateTime.now());
        completion.setRewardAvailableOn(null);
        completion.setRewardMinutes(0);
        completion.setRewardConsumedMinutes(0);

        MissionCompletion saved = missionCompletionRepository.save(completion);
        return toTodoResponse(mission, saved);
    }

    @Transactional(readOnly = true)
    public List<MissionTodoResponse> getMissionsCompleted(Long childId) {
        return getAllMissions(childId).stream()
                .filter(m -> m.completedAt() != null && m.validatedAt() == null)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MissionTodoResponse> getMissionsValided(Long childId) {
        return getAllMissions(childId).stream()
                .filter(MissionTodoResponse::validated)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MissionTodoResponse> getMissionsRejected(Long childId) {
        return getAllMissions(childId).stream()
                .filter(m -> m.validatedAt() != null && !m.validated())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MissionTodoResponse> getAllMissions(Long childId) {
        userService.getUser(childId);

        List<MissionCompletion> childCompletions = missionCompletionRepository.findByIdIdUser(childId);
        Map<Long, MissionCompletion> byMissionId = new HashMap<>();
        for (MissionCompletion completion : childCompletions) {
            byMissionId.put(completion.getId().getIdMissions(), completion);
        }

        return missionRepository.findAll().stream()
                .map(mission -> toTodoResponse(mission, byMissionId.get(mission.getId())))
                .toList();
    }

    private MissionTodoResponse toTodoResponse(Mission mission, MissionCompletion completion) {
        if (completion == null) {
            return new MissionTodoResponse(
                    mission.getId(),
                    mission.getTitle(),
                    mission.getDescription(),
                    mission.getEstimatedDurationMinutes(),
                    false,
                    null,
                    null,
                    null,
                    0,
                    0);
        }

        return new MissionTodoResponse(
                mission.getId(),
                mission.getTitle(),
                mission.getDescription(),
                mission.getEstimatedDurationMinutes(),
                completion.isValide(),
                completion.getCompletedAt(),
                completion.getValidatedAt(),
                completion.getRewardAvailableOn(),
                completion.getRewardMinutes(),
                completion.remainingRewardMinutes());
    }
}
