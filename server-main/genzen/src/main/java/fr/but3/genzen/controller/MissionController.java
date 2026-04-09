package fr.but3.genzen.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import fr.but3.genzen.beans.Mission;
import fr.but3.genzen.dto.MissionCreateRequest;
import fr.but3.genzen.dto.MissionTodoResponse;
import fr.but3.genzen.service.MissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mission createMission(@Valid @RequestBody MissionCreateRequest request) {
        return missionService.createMission(request);
    }

    @GetMapping("/todo/{childId}")
    public ResponseEntity<List<MissionTodoResponse>> getMissionsToDo(@PathVariable Long childId) {
        return ResponseEntity.ok(missionService.getMissionsToDo(childId));
    }

    @GetMapping("/completed/{childId}")
    public ResponseEntity<List<MissionTodoResponse>> getMissionsCompleted(@PathVariable Long childId) {
        return ResponseEntity.ok(missionService.getMissionsCompleted(childId));
    }

    @GetMapping("/valided/{childId}")
    public ResponseEntity<List<MissionTodoResponse>> getMissionsValided(@PathVariable Long childId) {
        return ResponseEntity.ok(missionService.getMissionsValided(childId));
    }

    @GetMapping("/rejected/{childId}")
    public ResponseEntity<List<MissionTodoResponse>> getMissionsRejected(@PathVariable Long childId) {
        return ResponseEntity.ok(missionService.getMissionsRejected(childId));
    }

    @GetMapping("/all/{childId}")
    public ResponseEntity<List<MissionTodoResponse>> getAllMissions(@PathVariable Long childId) {
        return ResponseEntity.ok(missionService.getAllMissions(childId));
    }

    @PostMapping("/complete/{childId}/{missionId}")
    public ResponseEntity<MissionTodoResponse> completeMission(@PathVariable Long childId, @PathVariable Long missionId) {
        return ResponseEntity.ok(missionService.completeMission(childId, missionId));
    }

    @PostMapping("/validate/{childId}/{missionId}")
    public ResponseEntity<MissionTodoResponse> validateMission(@PathVariable Long childId, @PathVariable Long missionId) {
        return ResponseEntity.ok(missionService.validateMission(childId, missionId));
    }

    @PostMapping("/reject/{childId}/{missionId}")
    public ResponseEntity<MissionTodoResponse> rejectMission(@PathVariable Long childId, @PathVariable Long missionId) {
        return ResponseEntity.ok(missionService.rejectMission(childId, missionId));
    }
}
