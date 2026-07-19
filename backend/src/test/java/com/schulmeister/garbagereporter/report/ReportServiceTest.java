package com.schulmeister.garbagereporter.report;

import com.schulmeister.garbagereporter.trashbin.Trashbin;
import com.schulmeister.garbagereporter.trashbin.TrashbinRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
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
    Long id = 4L;
    String obsolete = "obsolete";

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

    @Test
    void findAll() {

        Report report = getReport();
        List<Report> reports = new ArrayList<>();
        reports.add(report);
        Trashbin bin = getTrashbin();
        List<Trashbin> bins = new ArrayList<>();
        bins.add(bin);
        when(trashbinRepository.findAll()).thenReturn(bins);
        when(repository.findAll(Sort.by(Sort.Direction.DESC, "created"))).thenReturn(reports);

        List<BinReport> reportBins = reportService.findAll();
        assertNotNull(reportBins);
        assertEquals(1, reportBins.size());
        BinReport reportBin = reportBins.getFirst();
        assertEquals(number, reportBin.getReport().getTrashbinId());
        assertEquals(reportBin.getTrashbin().getNumber(), reportBin.getReport().getTrashbinId());
    }

    @Test
    void updateStatus() {

        Report report = getReport();
        when(repository.findById(id)).thenReturn(Optional.of(report));
        when(repository.save(org.mockito.ArgumentMatchers.any(Report.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ReportStatusUpdateRequest request = getReportUpdateRequest();
        ResponseEntity<String> responseEntity = reportService.updateStatus(request);
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        String response =responseEntity.getBody();
        assertNotNull(response);
        assertNotEquals("", response);
        assertTrue(response.contains(STATUS_UPDATED));
        assertTrue(response.contains(obsolete));
    }

    private ReportRequest getReportRequest() {
        return ReportRequest.builder()
                .trashbinId(number)
                .type("voll")
                .description("Der Mülleimer ist schon seit 1 Woche voll")
                .image("2234.jpg")
                .build();
    }

    private ReportStatusUpdateRequest getReportUpdateRequest() {
        ReportStatusUpdateRequest reportUpdateRequest = new ReportStatusUpdateRequest();
        reportUpdateRequest.setId(id);
        reportUpdateRequest.setStatus(obsolete);
        return reportUpdateRequest;
    }

    private Trashbin getTrashbin() {
        Trashbin trashbin = new Trashbin();
        trashbin.setNumber(number);
        trashbin.setType("Mülleimer 80L");
        return trashbin;
    }

    private Report getReport() {
        Report report = new Report();
        report.setId(id);
        report.setTrashbinId(number);
        report.setType("voll");
        return report;
    }

}