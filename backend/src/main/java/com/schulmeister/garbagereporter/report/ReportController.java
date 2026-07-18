package com.schulmeister.garbagereporter.report;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/report")
@Slf4j
@AllArgsConstructor
public class ReportController {

    ReportService reportService;
    FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<String> add(@RequestBody @Valid ReportRequest request) {
        return reportService.add(request);
    }

    @PostMapping("/upload/image")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.store(file);
        log.info("filename {}", filename);
        return Map.of("filename", filename);
    }

    @GetMapping("/get/{number}")
    public ResponseEntity<Report> findByNumber(
            @PathVariable Long number) {

        Report report = reportService.findByTrashbin(number);
        log.info("Report {}, {}", number, report);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/list")
    public ResponseEntity<List<BinReport>> findAll() {
        List<BinReport> binReportList = reportService.findAll();
        log.info("Report bins: {}", binReportList);
        return ResponseEntity.ok(binReportList);
    }

}
