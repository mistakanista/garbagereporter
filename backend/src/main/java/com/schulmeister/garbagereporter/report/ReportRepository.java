package com.schulmeister.garbagereporter.report;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    Optional<Report> findByTrashbinId(Long trashbinId);


}

