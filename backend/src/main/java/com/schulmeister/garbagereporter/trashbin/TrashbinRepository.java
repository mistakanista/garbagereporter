package com.schulmeister.garbagereporter.trashbin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrashbinRepository extends JpaRepository<Trashbin, Long> {

    Optional<Trashbin> findByNumber(Long number);


}

