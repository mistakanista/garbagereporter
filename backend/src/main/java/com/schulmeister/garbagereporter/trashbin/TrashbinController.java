package com.schulmeister.garbagereporter.trashbin;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/trashbin")
@Slf4j
@AllArgsConstructor
public class TrashbinController {

    TrashbinService trashbinService;

    @PostMapping
    public ResponseEntity<String> add(@RequestBody @Valid TrashbinRequest request) {
        return trashbinService.add(request);
    }

    @GetMapping("/get/{number}")
    public ResponseEntity<Trashbin> findByNumber(
            @PathVariable Long number) {

        Trashbin trashbin = trashbinService.findByNumber(number);
        log.info("Trashbin {}, {}", number, trashbin);
        return ResponseEntity.ok(trashbin);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Trashbin>> findAll() {
        List<Trashbin> trashBinList = trashbinService.findAll();
        log.info("Trash bins: {}", trashBinList);
        return ResponseEntity.ok(trashBinList);
    }

}
