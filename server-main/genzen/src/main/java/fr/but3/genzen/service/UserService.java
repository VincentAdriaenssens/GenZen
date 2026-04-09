package fr.but3.genzen.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import fr.but3.genzen.beans.ParentDe;
import fr.but3.genzen.beans.User;
import fr.but3.genzen.dto.CreateUserRequest;
import fr.but3.genzen.dto.LoginRequest;
import fr.but3.genzen.dto.UserResponse;
import fr.but3.genzen.repository.ParentDeRepository;
import fr.but3.genzen.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ParentDeRepository parentDeRepository;

    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndMdp(request.email(), request.mdp())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));
        return toResponse(user);
    }

    @Transactional
    public UserResponse registerParent(CreateUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
        }

        User parent = User.builder()
                .email(request.email())
                .mdp(request.mdp())
                .admin(true)
                .build();
        return toResponse(userRepository.save(parent));
    }

    @Transactional
    public UserResponse addChild(String parentEmail, CreateUserRequest request) {
        User parent = userRepository.findByEmail(parentEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent introuvable"));

        if (!parent.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul un parent peut ajouter un enfant");
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
        }

        User child = User.builder()
                .email(request.email())
                .mdp(request.mdp())
                .admin(false)
                .build();

        User savedChild = userRepository.save(child);
        parentDeRepository.save(ParentDe.of(savedChild.getId(), parent.getId()));
        return toResponse(savedChild);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getChildren(Long parentId) {
        User parent = getUser(parentId);
        if (!parent.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul un parent peut lister ses enfants");
        }

        return parentDeRepository.findByIdIdParent(parentId).stream()
                .map(link -> getUser(link.getId().getIdUser()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserResponse(Long userId) {
        return toResponse(getUser(userId));
    }

    @Transactional(readOnly = true)
    public void ensureParentChildRelation(Long parentId, Long childId) {
        User parent = getUser(parentId);
        User child = getUser(childId);

        if (!parent.isAdmin() || child.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Couple parent/enfant invalide");
        }

        if (!parentDeRepository.existsByIdIdParentAndIdIdUser(parentId, childId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ce parent n'est pas lié à cet enfant");
        }
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.isAdmin());
    }
}
