package com.schulmeister.garbagereporter.report;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    Optional<Report> findByTrashbinId(Long trashbinId);
    List<Report> findByClient(String client, Sort sort);


}

