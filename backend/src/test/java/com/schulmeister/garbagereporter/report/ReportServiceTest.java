package com.schulmeister.garbagereporter.report;

import com.schulmeister.garbagereporter.trashbin.Trashbin;
import com.schulmeister.garbagereporter.trashbin.TrashbinRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

import static com.schulmeister.garbagereporter.report.ReportService.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ReportServiceTest {

    ReportRepository repository = mock(ReportRepository.class);
    TrashbinRepository trashbinRepository = mock(TrashbinRepository.class);

    ReportService reportService = new ReportService(repository, trashbinRepository);

    Long number = 2234L;

    @Test
    void reportAdded() {

        ReportRequest request = getReportRequest();
        Trashbin bin = getTrashbin();
        when(trashbinRepository.findByNumber(number)).thenReturn(Optional.of(bin));
        when(repository.save(org.mockito.ArgumentMatchers.any(Report.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<String> responseEntity = reportService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(REPORT_ADDED));
        assertTrue(response.contains(number.toString()));
    }

    @Test
    void trashbinMissing() {

        ReportRequest request = getReportRequest();
        when(trashbinRepository.findByNumber(number)).thenReturn(Optional.empty());

        ResponseEntity<String> responseEntity = reportService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(BIN_ABSENT));
        assertTrue(response.contains(number.toString()));
    }

    @Test
    void errorSaving() {

        ReportRequest request = getReportRequest();

        Trashbin bin = getTrashbin();
        when(trashbinRepository.findByNumber(number)).thenReturn(Optional.of(bin));
        when(repository.save(org.mockito.ArgumentMatchers.any(Report.class)))
                .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<String> responseEntity = reportService.add(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.UNPROCESSABLE_CONTENT, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(ERROR_SAVING_REPORT));
        assertTrue(response.contains(number.toString()));
    }



    private ReportRequest getReportRequest() {
        return ReportRequest.builder()
                .trashbinId(number)
                .type("voll")
                .description("Der Mülleimer ist schon seit 1 Woche voll")
                .image("2234.jpg")
                .build();
    }

    private Trashbin getTrashbin() {
        Trashbin trashbin = new Trashbin();
        trashbin.setNumber(number);
        trashbin.setType("Mülleimer 80L");
        return trashbin;
    }

}