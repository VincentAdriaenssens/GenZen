package fr.but3.genzen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.but3.genzen.beans.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndMdp(String email, String mdp);
}
