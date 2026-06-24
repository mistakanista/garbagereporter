package com.schulmeister.barcamp.topics;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "topic")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String name;

    private String description;

    private String categories;

    @Column(nullable = false)
    private boolean accepted;

    private Integer likes;
}

