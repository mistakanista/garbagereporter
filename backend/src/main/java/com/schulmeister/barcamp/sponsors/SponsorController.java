package com.schulmeister.barcamp.sponsors;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/sponsors")
@Slf4j
@AllArgsConstructor
public class SponsorController {

    SponsorService sponsorService;
    FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<String> add(@RequestBody @Valid SponsorRequest request) {
        return sponsorService.add(request);
    }

    @PostMapping("/upload/sponsor-logo")
    public Map<String, String> uploadLogo(@RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.store(file);
        log.info("filename {}", filename);
        return Map.of("filename", filename);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Sponsor>> findByLevel(
            @RequestParam("level") String level) {

        List<Sponsor> sponsorList = sponsorService.findByLevel(level);
        log.info("Sponsors for level {}, {}", level, sponsorList);
        return ResponseEntity.ok(sponsorList);
    }



}
