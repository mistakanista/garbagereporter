package com.schulmeister.garbagereporter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GarbageReporterApplication {

    public static void main(String[] args) {
        SpringApplication.run(GarbageReporterApplication.class, args);
    }

}
