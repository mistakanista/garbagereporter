package com.schulmeister.barcamp.registration;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    Optional<Registration> findByEmail(String email);

    Optional<Registration> findByConfirmationToken(String token);

    Optional<Registration> findByUnregisterToken(String token);

}

