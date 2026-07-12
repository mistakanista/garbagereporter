package com.schulmeister.garbagereporter.trashbin;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Optional;

import static com.schulmeister.garbagereporter.trashbin.TrashbinService.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TrashbinServiceTest {

    TrashbinRepository repository = mock(TrashbinRepository.class);

    TrashbinService trashbinService = new TrashbinService(repository);

    Long number = 2234L;

    @Test
    void sponsorAdded() {

        TrashbinRequest request = getTrashbinRequest();

        when(repository.findByNumber(number)).thenReturn(Optional.empty());
        when(repository.save(org.mockito.ArgumentMatchers.any(Trashbin.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<String> responseEntity = trashbinService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(TRASH_BIN_ADDED));
        assertTrue(response.contains(number.toString()));
    }

    @Test
    void duplicateSponsor() {

        TrashbinRequest request = getTrashbinRequest();

        when(repository.findByNumber(number)).thenReturn(Optional.of(new Trashbin()));

        ResponseEntity<String> responseEntity = trashbinService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(EXISTING_NUMBER));
        assertTrue(response.contains(number.toString()));
    }

    @Test
    void errorSaving() {

        TrashbinRequest request = getTrashbinRequest();

        when(repository.findByNumber(number)).thenReturn((Optional.empty()));
        when(repository.save(org.mockito.ArgumentMatchers.any(Trashbin.class)))
                .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<String> responseEntity = trashbinService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.UNPROCESSABLE_CONTENT, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(ERROR_SAVING_TRASH_BIN));
        assertTrue(response.contains(number.toString()));
    }



    private TrashbinRequest getTrashbinRequest() {
        return TrashbinRequest.builder()
                .number(number)
                .type("Mülleimer 80L")
                .location("Gegenüber Penny")
                .district("Wolfgang")
                .street("Alfred-Nobel-Bogen")
                .houseNumber("5")
                .zip("63457")
                .city("Hanau")
                .latitude(new BigDecimal("50.12708652788195"))
                .longitude(new BigDecimal("8.946542404178638"))
                .build();
    }
}