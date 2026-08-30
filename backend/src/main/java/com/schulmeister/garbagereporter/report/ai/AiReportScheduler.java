package com.schulmeister.garbagereporter.report.ai;

import com.schulmeister.garbagereporter.report.ReportService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AiReportScheduler {

    private final ReportService reportService;

    public AiReportScheduler(ReportService reportService) {
        this.reportService = reportService;
    }

    @Scheduled(cron = "${garbage-reporter.ai.cron}")
    public void checkReports() {
        reportService.checkPendingReports();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void checkOnStartup() {
        checkReports();
    }
}
