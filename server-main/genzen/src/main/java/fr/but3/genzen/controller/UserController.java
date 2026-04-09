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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import fr.but3.genzen.dto.CreateUserRequest;
import fr.but3.genzen.dto.LoginRequest;
import fr.but3.genzen.dto.UserResponse;
import fr.but3.genzen.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String mdp,
            @RequestBody(required = false) LoginRequest body,
            jakarta.servlet.http.HttpSession session) {

        LoginRequest request = body != null
                ? body
                : new LoginRequest(email, mdp);

        UserResponse user = userService.login(request);
        session.setAttribute("user", user);

        return ResponseEntity.ok(user);
    }


    @PostMapping("/register/parent")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerParent(@Valid @RequestBody CreateUserRequest request) {
        return userService.registerParent(request);
    }

    @PostMapping("/{parentEmail}/addChild")
    public ResponseEntity<UserResponse> addChild(
            @PathVariable String parentEmail,
            @Valid @RequestBody CreateUserRequest child) {
        return ResponseEntity.ok(userService.addChild(parentEmail, child));
    }

    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<UserResponse>> getChildren(@PathVariable Long parentId) {
        return ResponseEntity.ok(userService.getChildren(parentId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserResponse(userId));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(jakarta.servlet.http.HttpSession session) {
        return ResponseEntity.ok((UserResponse) session.getAttribute("user"));
    }   

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(jakarta.servlet.http.HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }
}
