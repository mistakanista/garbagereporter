package com.schulmeister.barcamp.registration;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "registration")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String company;

    @Column(nullable = false)
    private boolean acceptConditions;

    @Column(nullable = false)
    private boolean confirmedRegistration;

    @Column(nullable = false)
    private boolean cancelledParticipation;

    @Column(nullable = false)
    private LocalDateTime lastModified;

    @Column(unique = true)
    private String confirmationToken;

    @Column(unique = true)
    private String unregisterToken;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastModified = LocalDateTime.now();
    }
}

