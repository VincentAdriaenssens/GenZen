package fr.but3.genzen.service;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import fr.but3.genzen.beans.ScreenTimeSettings;
import fr.but3.genzen.dto.ConsumeRewardRequest;
import fr.but3.genzen.dto.TempOverviewResponse;
import fr.but3.genzen.dto.TempSettingsRequest;
import fr.but3.genzen.repository.MissionCompletionRepository;
import fr.but3.genzen.repository.ScreenTimeSettingsRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScreenTimeService {

    private final ScreenTimeSettingsRepository screenTimeSettingsRepository;
    private final MissionCompletionRepository missionCompletionRepository;
    private final UserService userService;

    @Transactional
    public TempOverviewResponse setTemp(Long childId, TempSettingsRequest request) {
        userService.getUser(childId);

        ScreenTimeSettings settings = screenTimeSettingsRepository.findByChildId(childId)
                .orElse(ScreenTimeSettings.builder().childId(childId).build());

        settings.setDailyLimitMinutes(request.tempsMax());
        settings.setRewardMinutesPerMission(request.tempsRecompenses());
        screenTimeSettingsRepository.save(settings);

        return getTemp(childId);
    }

    @Transactional(readOnly = true)
    public TempOverviewResponse getTemp(Long childId) {
        userService.getUser(childId);

        ScreenTimeSettings settings = screenTimeSettingsRepository.findByChildId(childId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paramétrage temps introuvable"));

        int bonus = missionCompletionRepository.computeAvailableRewardMinutes(childId, LocalDate.now());
        return new TempOverviewResponse(
                childId,
                settings.getDailyLimitMinutes(),
                settings.getRewardMinutesPerMission(),
                bonus,
                settings.getDailyLimitMinutes() + bonus);
    }

    @Transactional
    public TempOverviewResponse consumeReward(Long childId, ConsumeRewardRequest request) {
        userService.getUser(childId);

        int available = missionCompletionRepository.computeAvailableRewardMinutes(childId, LocalDate.now());
        if (request.minutes() > available) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Minutes demandées supérieures au bonus disponible aujourd'hui");
        }

        int remainingToConsume = request.minutes();
        var rewards = missionCompletionRepository.findConsumableRewards(childId, LocalDate.now());
        for (var reward : rewards) {
            if (remainingToConsume <= 0) {
                break;
            }
            int remainingOnLine = reward.getRewardMinutes() - reward.getRewardConsumedMinutes();
            int consumeNow = Math.min(remainingOnLine, remainingToConsume);
            reward.setRewardConsumedMinutes(reward.getRewardConsumedMinutes() + consumeNow);
            remainingToConsume -= consumeNow;
        }

        missionCompletionRepository.saveAll(rewards);
        return getTemp(childId);
    }
}
