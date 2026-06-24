package com.schulmeister.barcamp.sponsors;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "sponsor")
public class Sponsor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String logo;

    @Column(nullable = false)
    private String level;

    @Column
    private String link;

    private Integer sort;
}

