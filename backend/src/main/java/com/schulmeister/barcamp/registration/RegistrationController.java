package com.schulmeister.barcamp.registration;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/registrations")
@Slf4j
@AllArgsConstructor
public class RegistrationController {

    RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest request) {
        return registrationService.register(request);
    }

    @PostMapping("unregister")
    public ResponseEntity<String> unRegisterRequest(@RequestBody @Valid UnRegistrationRequest request) {
        log.info("unregister request {}", request.getEmail());
        return registrationService.unRegisterRequest(request);
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(
            @RequestParam("token") String token) {

        String response = registrationService.findUser(token);
        log.info(response);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping
    public ResponseEntity<String> unregister(@RequestParam("token") String token) {
        log.info("delete token {}", token);
        return registrationService.deleteUser(token);
    }
}
