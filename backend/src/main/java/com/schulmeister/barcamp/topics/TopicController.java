package com.schulmeister.barcamp.topics;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/topics")
@Slf4j
@AllArgsConstructor
public class TopicController {

    TopicService topicService;

    @PostMapping
    public ResponseEntity<String> suggest(@RequestBody @Valid TopicRequest request) {
        return topicService.suggest(request);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Topic>> findAllAccepted() {

        List<Topic> topicList = topicService.findAllAccepted();
        log.info("Accepted topics {}", topicList);
        return ResponseEntity.ok(topicList);
    }

    @GetMapping("/listUnaccepted")
    public ResponseEntity<List<Topic>> findAllNotAccepted() {
        List<Topic> topicList = topicService.findAllUnaccepted();
        log.info("Unaccepted topics {}", topicList);
        return ResponseEntity.ok(topicList);
    }

    @GetMapping("/like")
    public ResponseEntity<String> increaseLikes(
            @RequestParam("id") Long id) {

        String response = topicService.increaseLikes(id);
        log.info(response);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/accept")
    public ResponseEntity<String> update(@RequestBody @Valid TopicUpdateRequest request) {
        return topicService.acceptTopic(request);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return topicService.deleteTopic(id);
    }
}
