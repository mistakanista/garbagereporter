package com.schulmeister.barcamp.registration;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class RegistrationService {

    public static final String REGISTRATION_SUCCESSFUL = "Registration successful for email: ";
    public static final String CONFIRMATION_TOKEN = "Confirmation token:";
    public static final String REGISTERED_EMAIL = "Registration attempt with already registered email: ";
    public static final String ERROR_SAVING = "Error saving registration for email: ";
    public static final String INVALID_CONFIRMATION_TOKEN = "Invalid confirmation token or user already registered";
    public static final String REGISTRATION_CONFIRMED = "Registration confirmed for: ";
    public static final String REGISTRATION_NOT_FOND = "Registration could not be found or invalid token: ";
    public static final String NO_REGISTRATION_FOUND = "No registration with the following email could be found: ";
    public static final String UNREGISTER_EMAIL_SENT = "An email has been sent to unregister to: ";
    public static final String UNREGISTER_SUCCESS = "Your registration has been successfully unregistered for email: ";
    private RegistrationRepository repository;
    private MailService mailService;

    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest request) {
        String response;
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            response = REGISTERED_EMAIL + request.getEmail();
            log.warn(response);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Registration registration = new Registration();
        registration.setName(request.getName());
        registration.setEmail(request.getEmail());
        registration.setCompany(request.getCompany());
        registration.setAcceptConditions(request.isAcceptConditions());
        registration.setConfirmedRegistration(false);
        registration.setCancelledParticipation(false);
        String token = UUID.randomUUID().toString();
        registration.setConfirmationToken(token);
        log.info("token {}", token);
        try {
            response = REGISTRATION_SUCCESSFUL + request.getEmail() + ". " + CONFIRMATION_TOKEN + " " + token;
            repository.save(registration);
            mailService.sendConfirmationMail(registration, true);
        } catch (Exception e) {
            response = ERROR_SAVING + request.getEmail();
            log.error(response + " {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public String findUser(String token) {
        String response = REGISTRATION_NOT_FOND + token;
        Optional<Registration> registrationOptional = repository.findByConfirmationToken(token);
        if (registrationOptional.isPresent()) {
            response = handleRegistration(registrationOptional.get());
        }
        return response;
    }

    private String handleRegistration(Registration registration) {
        String response;
        if (registration.isConfirmedRegistration()) {
            response = INVALID_CONFIRMATION_TOKEN;
        } else {
            registration.setConfirmedRegistration(true);
            repository.save(registration);
            response = REGISTRATION_CONFIRMED + registration.getEmail();
        }

        return response;
    }

    public ResponseEntity<String> unRegisterRequest(@Valid UnRegistrationRequest request) {
        String response;
        Optional <Registration> registrationOptional = repository.findByEmail(request.getEmail());
        if (registrationOptional.isEmpty()) {
            response = NO_REGISTRATION_FOUND + request.getEmail();
            log.warn(response);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Registration registration = registrationOptional.get();
        String unregisterToken = UUID.randomUUID().toString();
        registration.setUnregisterToken(unregisterToken);
        try {
            response = UNREGISTER_EMAIL_SENT + request.getEmail();
            repository.save(registration);
            mailService.sendUregisterMail(registration, true);
        } catch (Exception e) {
            response = ERROR_SAVING + request.getEmail();
            log.error(response + " {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
        }
        log.info(response);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<String> deleteUser(String token) {
        String response;
        Optional <Registration> registrationOptional = repository.findByUnregisterToken(token);
        if (registrationOptional.isEmpty()) {
            response = REGISTRATION_NOT_FOND + token;
            log.warn(response);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        Registration registration = registrationOptional.get();
        repository.delete(registration);
        response = UNREGISTER_SUCCESS + registration.getEmail();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
