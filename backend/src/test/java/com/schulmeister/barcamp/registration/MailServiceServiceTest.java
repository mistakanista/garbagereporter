package com.schulmeister.barcamp.registration;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.UUID;

import static org.mockito.Mockito.*;

class MailServiceServiceTest {

    JavaMailSender mailSender = mock(JavaMailSender.class);

    MailService mailService = new MailService(mailSender);

    MimeMessage mimeMessage = mock(MimeMessage.class);

    String email = "test@test.de";

    @Test
    void mailSent() {

        String token = UUID.randomUUID().toString();
        Registration registration = new Registration();
        registration.setConfirmationToken(token);
        registration.setConfirmedRegistration(false);
        registration.setEmail(email);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        mailService.sendConfirmationMail(registration, true);

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void mailNotSent() {

        String token = UUID.randomUUID().toString();
        Registration registration = new Registration();
        registration.setConfirmationToken(token);
        registration.setConfirmedRegistration(false);
        registration.setEmail(email);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        mailService.sendConfirmationMail(registration, false);

        verify(mailSender, times(0)).send(any(SimpleMailMessage.class));
    }

    @Test
    void alreadyRegistered() {

        String token = UUID.randomUUID().toString();
        Registration registration = new Registration();
        registration.setConfirmationToken(token);
        registration.setConfirmedRegistration(true);
        registration.setEmail(email);
        mailService.sendConfirmationMail(registration, false);

        verify(mailSender, times(0)).send(any(SimpleMailMessage.class));
    }

    @Test
    void unregisterMailSent() {

        String token = UUID.randomUUID().toString();
        Registration registration = new Registration();
        registration.setUnregisterToken(token);
        registration.setEmail(email);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        mailService.sendConfirmationMail(registration, true);

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void unregisterMailNotSent() {

        String token = UUID.randomUUID().toString();
        Registration registration = new Registration();
        registration.setUnregisterToken(token);
        registration.setEmail(email);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        mailService.sendConfirmationMail(registration, false);

        verify(mailSender, times(0)).send(any(SimpleMailMessage.class));
    }
}