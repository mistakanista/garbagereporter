package com.schulmeister.garbagereporter.report;

import com.schulmeister.garbagereporter.report.ai.AiReportService;
import com.schulmeister.garbagereporter.report.ai.MockAiReportService;
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
import static com.schulmeister.garbagereporter.trashbin.TrashbinService.CLIENT;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ReportServiceTest {

    public static final String NEW = Status.NEW.getStatusValue();
    public static final String FULL = "voll";
    public static final String OBSOLETE = Status.OBSOLETE.getStatusValue();
    ReportRepository repository = mock(ReportRepository.class);
    TrashbinRepository trashbinRepository = mock(TrashbinRepository.class);
    AiReportService aiReportService = new MockAiReportService();

    ReportService reportService = new ReportService(repository, trashbinRepository, aiReportService);

    Long number = 2234L;
    Long id = 4L;


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
    void findByClient() {

        Report report = getReport();
        List<Report> reports = new ArrayList<>();
        reports.add(report);
        Trashbin bin = getTrashbin();
        List<Trashbin> bins = new ArrayList<>();
        bins.add(bin);
        when(trashbinRepository.findByClient(CLIENT)).thenReturn(bins);
        when(repository.findByClient(CLIENT, Sort.by(Sort.Direction.DESC, "created"))).thenReturn(reports);

        List<BinReport> reportBins = reportService.findByClient();
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
        assertTrue(response.contains(OBSOLETE));
    }

    @Test
    void reportAiConfirmed() {

        Report report = getReport();
        when(repository.findByStatus(Status.NEW.getStatusValue())).thenReturn(List.of(report));
        when(repository.save(org.mockito.ArgumentMatchers.any(Report.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        List<Report> reports = reportService.checkPendingReports();
        assertNotNull(reports);
        Report updatedReport = reports.getFirst();
        assertTrue(updatedReport.isAiApproved());
    }

    @Test
    void reportAiNotConfirmed() {

        Report report = getReportObsolete();
        when(repository.findByStatus(Status.NEW.getStatusValue())).thenReturn(List.of(report));
        when(repository.save(org.mockito.ArgumentMatchers.any(Report.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        List<Report> reports = reportService.checkPendingReports();
        assertNotNull(reports);
        Report updatedReport = reports.getFirst();
        assertFalse(updatedReport.isAiApproved());
    }

    private ReportRequest getReportRequest() {
        return ReportRequest.builder()
                .trashbinId(number)
                .type(FULL)
                .description("Der Mülleimer ist schon seit 1 Woche voll")
                .image("2234.jpg")
                .build();
    }

    private ReportStatusUpdateRequest getReportUpdateRequest() {
        ReportStatusUpdateRequest reportUpdateRequest = new ReportStatusUpdateRequest();
        reportUpdateRequest.setId(id);
        reportUpdateRequest.setStatus(OBSOLETE);
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
        report.setType(FULL);
        report.setStatus(NEW);
        return report;
    }

    private Report getReportObsolete() {
        Report report = new Report();
        report.setId(id);
        report.setTrashbinId(number);
        report.setType(FULL);
        report.setStatus(OBSOLETE);
        return report;
    }

}