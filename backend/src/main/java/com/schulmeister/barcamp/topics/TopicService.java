package com.schulmeister.barcamp.topics;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class TopicService {

    public static final String SAVED_SUCCESSFULLY = "Topic saved successfully: ";
    public static final String ACCEPTED_SUCCESSFULLY = "Topic accepted successfully: ";
    public static final String DELETED_SUCCESSFULLY = "Topic deleted successfully: ";
    public static final String ERROR_SAVING = "Error saving topic: ";
    public static final String TOPIC_NOT_FOUND = "A topic with this id could not be found: ";
    public static final String LIKES_INCREASED = "Likes increased for topic: ";
    public static final String TOTAL_LIKES = ". Total likes: ";
    private TopicRepository repository;

    public ResponseEntity<String> suggest(@RequestBody @Valid TopicRequest request) {
        String response;

        Topic topic = new Topic();
        topic.setName(request.getName());
        topic.setTitle(request.getTitle());
        topic.setDescription(request.getDescription());
        topic.setCategories(request.getCategories());
        topic.setLikes(0);
        try {
            response = SAVED_SUCCESSFULLY + request.getTitle();
            repository.save(topic);
        } catch (Exception e) {
            response = ERROR_SAVING + request.getTitle();
            log.error(response + " {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public List<Topic> findAllAccepted() {
        return repository.findByAcceptedOrderByLikesDesc(true);
    }

    public List<Topic> findAllUnaccepted() {
        return repository.findByAcceptedOrderByLikesDesc(false);
    }

    public String increaseLikes(Long id) {
        String response = TOPIC_NOT_FOUND + id;
        Optional<Topic> topicOptional = repository.findById(id);
        if (topicOptional.isPresent()) {
            Topic topic = topicOptional.get();
            topic.setLikes(topic.getLikes() + 1);
            repository.save(topic);
            return LIKES_INCREASED + topic.getTitle() + TOTAL_LIKES + topic.getLikes();
        }
        return response;
    }

    public ResponseEntity<String> acceptTopic(@Valid TopicUpdateRequest request) {
        String response = TOPIC_NOT_FOUND + request.getId();
        Optional<Topic> topicOptional = repository.findById(request.getId());
        if (topicOptional.isPresent()) {
            Topic topic = topicOptional.get();
            topic.setTitle(request.getTitle());
            topic.setDescription(request.getDescription());
            topic.setCategories(request.getCategories());
            topic.setName(request.getName());
            topic.setAccepted(true);
            try {
                response = ACCEPTED_SUCCESSFULLY + request.getTitle();
                repository.save(topic);
            } catch (Exception e) {
                response = ERROR_SAVING + request.getTitle();
                log.error(response + " {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
            }
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    public ResponseEntity<String> deleteTopic(Long id) {
        String response = TOPIC_NOT_FOUND + id;
        Optional<Topic> topicOptional = repository.findById(id);
        if (topicOptional.isPresent()) {
            Topic topic = topicOptional.get();
            repository.delete(topic);
            response = DELETED_SUCCESSFULLY + topic.getTitle();
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        }
        log.warn(response);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
