package com.schulmeister.barcamp.registration;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

import static com.schulmeister.barcamp.registration.RegistrationService.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RegistrationServiceTest {

    RegistrationRepository repository = mock(RegistrationRepository.class);

    MailService mailService = mock(MailService.class);

    RegistrationService registrationService = new RegistrationService(repository, mailService);

    String email = "test@test.de";

    @Test
    void registerSucceeds() {

        RegistrationRequest request = getRegistrationRequest();

        when(repository.findByEmail(email)).thenReturn(java.util.Optional.empty());
        when(repository.save(org.mockito.ArgumentMatchers.any(Registration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<String> responseEntity = registrationService.register(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(REGISTRATION_SUCCESSFUL));
        assertTrue(response.contains(CONFIRMATION_TOKEN));
        assertTrue(response.contains(email));
    }

    @Test
    void registerDuplicateEmail() {

        RegistrationRequest request = getRegistrationRequest();

        when(repository.findByEmail(email)).thenReturn(Optional.of(new Registration()));

        ResponseEntity<String> responseEntity = registrationService.register(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(REGISTERED_EMAIL));
        assertTrue(response.contains(email));
    }

    @Test
    void errorSaving() {

        RegistrationRequest request = getRegistrationRequest();

        when(repository.findByEmail(email)).thenReturn((java.util.Optional.empty()));
        when(repository.save(org.mockito.ArgumentMatchers.any(Registration.class)))
                .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<String> responseEntity = registrationService.register(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.UNPROCESSABLE_CONTENT, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(ERROR_SAVING));
        assertTrue(response.contains(email));
    }

    @Test
    void confirmRegistration() {

        String token = UUID.randomUUID().toString();
        Registration registration = new Registration();
        registration.setConfirmationToken(token);
        registration.setConfirmedRegistration(false);
        registration.setEmail(email);

        when(repository.findByConfirmationToken(token)).thenReturn(java.util.Optional.of(registration));
        when(repository.save(org.mockito.ArgumentMatchers.any(Registration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        String response = registrationService.findUser(token);
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(REGISTRATION_CONFIRMED));
        assertTrue(response.contains(email));
    }

    @Test
    void userNotFound() {

        String token = UUID.randomUUID().toString();

         when(repository.findByConfirmationToken(token)).thenReturn(java.util.Optional.empty());

        String response = registrationService.findUser(token);
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(REGISTRATION_NOT_FOND));
        assertTrue(response.contains(token));
    }

    @Test
    void registrationAlreadyConfirmed() {

        String token = UUID.randomUUID().toString();
        Registration registration = new Registration();
        registration.setConfirmationToken(token);
        registration.setConfirmedRegistration(true);
        registration.setEmail(email);

        when(repository.findByConfirmationToken(token)).thenReturn(Optional.of(registration));

        String response = registrationService.findUser(token);
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(INVALID_CONFIRMATION_TOKEN));
    }

    @Test
    void unregistrationNoEmail() {

        UnRegistrationRequest request = UnRegistrationRequest.builder().email(email).build();

        when(repository.findByEmail(email)).thenReturn(Optional.empty());
        ResponseEntity<String> responseEntity = registrationService.unRegisterRequest(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());


        String response = responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(NO_REGISTRATION_FOUND));
    }

    @Test
    void unregistrationSuccess() {

        UnRegistrationRequest request = UnRegistrationRequest.builder().email(email).build();

        Registration registration = new Registration();
        registration.setEmail(email);

        when(repository.findByEmail(email)).thenReturn(Optional.of(registration));
        when(repository.save(org.mockito.ArgumentMatchers.any(Registration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ResponseEntity<String> responseEntity = registrationService.unRegisterRequest(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());


        String response = responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(UNREGISTER_EMAIL_SENT));
        assertTrue(response.contains(email));
    }

    @Test
    void deleteSuccess() {

        String token = UUID.randomUUID().toString();

        Registration registration = new Registration();
        registration.setEmail(email);

        when(repository.findByUnregisterToken(token)).thenReturn(Optional.of(registration));

        ResponseEntity<String> responseEntity = registrationService.deleteUser(token);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());


        String response = responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(UNREGISTER_SUCCESS));
        assertTrue(response.contains(email));
    }

    @Test
    void deleteFailure() {

        String token = UUID.randomUUID().toString();

         when(repository.findByUnregisterToken(token)).thenReturn(Optional.empty());

        ResponseEntity<String> responseEntity = registrationService.deleteUser(token);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());


        String response = responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(REGISTRATION_NOT_FOND));
    }



    private RegistrationRequest getRegistrationRequest() {
        return RegistrationRequest.builder()
                .name("John Doe")
                .email(email)
                .company("Google")
                .acceptConditions(true)
                .build();
    }
}