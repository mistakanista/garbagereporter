package com.schulmeister.garbagereporter.trashbin;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;
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
    void trashBinAdded() {

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
    void duplicateTrashBin() {

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

    @Test
    void listTrashbins() {

        when(repository.findByClient(CLIENT)).thenReturn(List.of(getTrashbin()));

        List<Trashbin> trashbins = trashbinService.findByClient();
        assertNotNull(trashbins);
        assertEquals(1, trashbins.size());
        Trashbin trashbin = trashbins.getFirst();
        assertEquals(number, trashbin.getNumber());
        assertEquals(CLIENT, trashbin.getClient());
    }

    private Trashbin getTrashbin() {
        Trashbin trashbin = new Trashbin();
        trashbin.setNumber(number);
        trashbin.setType("Mülleimer 80L");
        trashbin.setClient(CLIENT);
        trashbin.setLocation("Gegenüber Penny");
        trashbin.setDistrict("Wolfgang");
        trashbin.setStreet("Alfred-Nobel-Bogen");
        trashbin.setHouseNumber("5");
        trashbin.setZip("63457");
        trashbin.setCity("Hanau");
        trashbin.setLatitude(new BigDecimal("50.12708652788195"));
        trashbin.setLongitude(new BigDecimal("8.946542404178638"));
        return trashbin;
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