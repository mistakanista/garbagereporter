package com.schulmeister.barcamp.sponsors;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static com.schulmeister.barcamp.sponsors.SponsorService.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SponsorServiceTest {

    SponsorRepository repository = mock(SponsorRepository.class);

    SponsorService sponsorService = new SponsorService(repository);

    String company = "google";

    @Test
    void sponsorAdded() {

        SponsorRequest request = getSponsorRequest();

        when(repository.findByCompany(company)).thenReturn(Optional.empty());
        when(repository.save(org.mockito.ArgumentMatchers.any(Sponsor.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<String> responseEntity = sponsorService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(SPONSOR_ADDED));
        assertTrue(response.contains(company));
    }

    @Test
    void duplicateSponsor() {

        SponsorRequest request = getSponsorRequest();

        when(repository.findByCompany(company)).thenReturn(Optional.of(new Sponsor()));

        ResponseEntity<String> responseEntity = sponsorService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(EXISTING_COMPANY));
        assertTrue(response.contains(company));
    }

    @Test
    void errorSaving() {

        SponsorRequest request = getSponsorRequest();

        when(repository.findByCompany(company)).thenReturn((Optional.empty()));
        when(repository.save(org.mockito.ArgumentMatchers.any(Sponsor.class)))
                .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<String> responseEntity = sponsorService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.UNPROCESSABLE_CONTENT, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(ERROR_SAVING_COMPANY));
        assertTrue(response.contains(company));
    }



    private SponsorRequest getSponsorRequest() {
        return SponsorRequest.builder()
                .name("John Doe")
                .email("test@test.de")
                .company(company)
                .logo("google.jpg")
                .level("gold")
                .sort(1)
                .build();
    }
}