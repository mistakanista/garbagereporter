package com.schulmeister.garbagereporter.trashbin;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class TrashbinService {

    public static final String TRASH_BIN_ADDED = "Trash bin successfully added: ";
    public static final String EXISTING_NUMBER = "The trash bin number already exists: ";
    public static final String ERROR_SAVING_TRASH_BIN = "Error saving trash bin: ";

    private TrashbinRepository repository;

    public ResponseEntity<String> add(@RequestBody @Valid TrashbinRequest request) {
        String response;
        if (repository.findByNumber(request.getNumber()).isPresent()) {
            response = EXISTING_NUMBER + request.getNumber();
            log.warn(response);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Trashbin trashbin = new Trashbin();
        trashbin.setNumber(request.getNumber());
        trashbin.setType(request.getType());
        trashbin.setLocation(request.getLocation());
        trashbin.setStreet(request.getStreet());
        trashbin.setHouseNumber(request.getHouseNumber());
        trashbin.setDistrict(request.getDistrict());
        trashbin.setZip(request.getZip());
        trashbin.setCity(request.getCity());
        trashbin.setLatitude(request.getLatitude());
        trashbin.setLongitude(request.getLongitude());
        trashbin.setLastModified(LocalDateTime.now());
        trashbin.setCreated(LocalDateTime.now());

        try {
            response = TRASH_BIN_ADDED + request.getNumber();
            repository.save(trashbin);
        } catch (Exception e) {
            response = ERROR_SAVING_TRASH_BIN + request.getNumber();
            log.error(response + " {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public Trashbin findByNumber(Long number) {
        Optional<Trashbin> trashbin = repository.findByNumber(number);
        return trashbin.orElse(null);
    }

    public List<Trashbin> findAll() {
        return repository.findAll();
    }
}
