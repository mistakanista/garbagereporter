package com.schulmeister.garbagereporter.report;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trashbin_id", nullable = false)
    private Long trashbinId;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    @Column(name = "ai_approved", nullable = false)
    private boolean aiApproved;

    @Column(nullable = false)
    private LocalDateTime lastModified;

    @Column(nullable = false)
    private LocalDateTime created;
}

