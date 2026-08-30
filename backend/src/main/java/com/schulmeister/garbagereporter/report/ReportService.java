package com.schulmeister.garbagereporter.report;

import com.schulmeister.garbagereporter.report.ai.AiReportResult;
import com.schulmeister.garbagereporter.report.ai.AiReportService;
import com.schulmeister.garbagereporter.report.ai.AiStatus;
import com.schulmeister.garbagereporter.trashbin.Trashbin;
import com.schulmeister.garbagereporter.trashbin.TrashbinRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.schulmeister.garbagereporter.trashbin.TrashbinService.CLIENT;

@Service
@AllArgsConstructor
@Slf4j
public class ReportService {

    public static final String REPORT_ADDED = "Report successfully added: ";
    public static final String ERROR_SAVING_REPORT = "Error saving report: ";
    public static final String STATUS_NEW = "new";
    public static final String BIN_ABSENT = "Trash bin does not exist ";
    public static final String REPORT_NOT_FOUND = "Report could not be found with id: ";
    public static final String STATUS_UPDATED = "Status updated successfully for : ";
    public static final String TIMEZONE = "Europe/Berlin";

    private ReportRepository repository;
    private TrashbinRepository trashbinRepository;
    private AiReportService aiService;

    public ResponseEntity<String> add(@RequestBody @Valid ReportRequest request) {
        String response;
        log.info("Request" + " {}", request);
        if (trashbinRepository.findByNumber(request.getTrashbinId()).isEmpty()) {
            response = BIN_ABSENT + request.getTrashbinId();
            log.warn(response);
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(response);
        }
        Report report = new Report();
        report.setTrashbinId(request.getTrashbinId());
        report.setType(request.getType());
        report.setImage(request.getImage());
        report.setDescription(request.getDescription());
        report.setAiApproved(false);
        report.setStatus(STATUS_NEW);
        report.setClient(CLIENT);
        report.setLastModified(LocalDateTime.now(ZoneId.of(TIMEZONE)));
        report.setCreated(LocalDateTime.now(ZoneId.of(TIMEZONE)));

        try {
            response = REPORT_ADDED + request.getTrashbinId();
            repository.save(report);
        } catch (Exception e) {
            response = ERROR_SAVING_REPORT + request.getTrashbinId();
            log.error(response + " {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public Report findByTrashbin(Long number) {
        Optional<Report> report = repository.findByTrashbinId(number);
        return report.orElse(null);
    }

    public List<BinReport> findByClient() {
        List<BinReport> binReportList = new ArrayList<>();
        List<Report> reportList = repository.findByClient(
                CLIENT,
                Sort.by(Sort.Direction.DESC, "created")
        );
        log.info("client: {}", CLIENT);
        log.info("reportList: {}", reportList);
        List<Trashbin> trashbinList = trashbinRepository.findByClient(CLIENT);
        for (Report report : reportList) {
            trashbinList.stream().filter(trashbin -> trashbin.getNumber().equals(report.getTrashbinId()))
                    .findFirst()
                    .ifPresent(trashbin -> {
                        BinReport binReport = new BinReport();
                        binReport.setReport(report);
                        binReport.setTrashbin(trashbin);
                        binReportList.add(binReport);
                    });
        }
        return binReportList;
    }

    public ResponseEntity<String> updateStatus(@Valid ReportStatusUpdateRequest request) {
        String response = REPORT_NOT_FOUND + request.getId();
        Optional<Report> reportOptional = repository.findById(request.getId());
        if (reportOptional.isPresent()) {
            Report report = reportOptional.get();
            report.setStatus(request.getStatus());
            report.setLastModified(LocalDateTime.now(ZoneId.of(TIMEZONE)));
            try {
                response = STATUS_UPDATED + report.getTrashbinId() + " Status: " + request.getStatus();
                repository.save(report);
            } catch (Exception e) {
                response = ERROR_SAVING_REPORT + report.getTrashbinId();
                log.error(response + " {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
            }
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    public List<Report> checkPendingReports() {
        log.info("Checking pending reports for AI approval");
        List<Report> pendingReports = repository.findByAiApproved(false);
        log.info("Pending reports: {}", pendingReports.size());
        for (Report report : pendingReports) {
            try {
                report.setAiStatus(AiStatus.PROCESSING);
                repository.save(report);

                AiReportResult result = aiService.analyze(report);

                if (result != null) {

                    report.setAiApproved(result.trashBinDetected() && result.reasonMatches());
                    report.setAiConfidence(result.confidence());
                    report.setAiReason(result.explanation());
                    report.setAiStatus(
                            report.isAiApproved()
                                    ? AiStatus.APPROVED
                                    : AiStatus.REJECTED
                    );
                    report.setAiCheckedAt(LocalDateTime.now(ZoneId.of(TIMEZONE)));

                    repository.save(report);
                }



            } catch (Exception e) {

                report.setAiStatus(AiStatus.ERROR);
                repository.save(report);

                log.error(
                        "AI analysis failed for report {}",
                        report.getId(),
                        e
                );
            }

            log.info("Report: {}", report);
        }
        return pendingReports;
    }
}
