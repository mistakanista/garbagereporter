package com.schulmeister.garbagereporter.report;

import com.schulmeister.garbagereporter.trashbin.Trashbin;
import com.schulmeister.garbagereporter.trashbin.TrashbinRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class ReportService {

    public static final String REPORT_ADDED = "Report successfully added: ";
    public static final String ERROR_SAVING_REPORT = "Error saving report: ";
    public static final String STATUS_NEW = "new";
    public static final String BIN_ABSENT = "Trash bin does not exist ";

    private ReportRepository repository;
    private TrashbinRepository trashbinRepository;

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
        report.setLastModified(LocalDateTime.now());
        report.setCreated(LocalDateTime.now());

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

    public List<BinReport> findAll() {
        List<BinReport> binReportList = new ArrayList<>();
        List<Report> reportList = repository.findAll();
        List<Trashbin> trashbinList = trashbinRepository.findAll();
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
}
