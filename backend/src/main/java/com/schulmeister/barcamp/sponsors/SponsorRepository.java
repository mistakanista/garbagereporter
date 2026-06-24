package com.schulmeister.barcamp.sponsors;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SponsorRepository extends JpaRepository<Sponsor, Long> {

    Optional<Sponsor> findByCompany(String company);

    List<Sponsor> findByLevelOrderBySort(String level);
}

