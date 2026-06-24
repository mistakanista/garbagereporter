package com.schulmeister.barcamp.topics;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findByAcceptedOrderByLikesDesc(boolean accepted);
}

