package fr.but3.genzen.dto;

public record UserResponse(
        Long id,
        String email,
        boolean parent
) {
}
