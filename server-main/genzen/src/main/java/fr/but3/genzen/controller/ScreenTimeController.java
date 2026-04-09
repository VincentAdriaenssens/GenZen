package fr.but3.genzen.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.but3.genzen.dto.ConsumeRewardRequest;
import fr.but3.genzen.dto.TempOverviewResponse;
import fr.but3.genzen.dto.TempSettingsRequest;
import fr.but3.genzen.service.ScreenTimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/temps")
@RequiredArgsConstructor
public class ScreenTimeController {

    private final ScreenTimeService screenTimeService;

    @PostMapping("/{childId}")
    public ResponseEntity<TempOverviewResponse> setTemp(
            @PathVariable Long childId,
            @Valid @RequestBody TempSettingsRequest request) {
        return ResponseEntity.ok(screenTimeService.setTemp(childId, request));
    }

    @GetMapping("/{childId}")
    public ResponseEntity<TempOverviewResponse> getTemp(@PathVariable Long childId) {
        return ResponseEntity.ok(screenTimeService.getTemp(childId));
    }

    @PostMapping("/{childId}/consume")
    public ResponseEntity<TempOverviewResponse> consumeReward(
            @PathVariable Long childId,
            @Valid @RequestBody ConsumeRewardRequest request) {
        return ResponseEntity.ok(screenTimeService.consumeReward(childId, request));
    }
}
