package com.schulmeister.barcamp.sponsors;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class SponsorService {

    public static final String SPONSOR_ADDED = "Sponsor successfully added: ";
    public static final String EXISTING_COMPANY = "The company is already registered as sponsor: ";
    public static final String ERROR_SAVING_COMPANY = "Error saving sponsor for company: ";

    private SponsorRepository repository;

    public ResponseEntity<String> add(@RequestBody @Valid SponsorRequest request) {
        String response;
        if (repository.findByCompany(request.getCompany()).isPresent()) {
            response = EXISTING_COMPANY + request.getCompany();
            log.warn(response);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Sponsor sponsor = new Sponsor();
        sponsor.setName(request.getName());
        sponsor.setEmail(request.getEmail());
        sponsor.setCompany(request.getCompany());
        sponsor.setLogo(request.getLogo());
        sponsor.setLevel(request.getLevel());
        sponsor.setSort(request.getSort());
        sponsor.setLink(request.getLink());

        try {
            response = SPONSOR_ADDED + request.getCompany();
            repository.save(sponsor);
        } catch (Exception e) {
            response = ERROR_SAVING_COMPANY + request.getCompany();
            log.error(response + " {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public List<Sponsor> findByLevel(String level) {
        return repository.findByLevelOrderBySort(level);
    }
}
