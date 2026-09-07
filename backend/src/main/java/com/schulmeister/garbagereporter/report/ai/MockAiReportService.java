package com.schulmeister.garbagereporter.report.ai;

import com.schulmeister.garbagereporter.report.Report;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("mock-ai")
@Slf4j
public class MockAiReportService implements AiReportService {

    @Override
    public AiReportResult analyze(Report report) {
        log.info("Profile: Mock-AI");
        if ("new".equals(report.getStatus())) {
            return new AiReportResult(
                    true,
                    true,
                    0.95,
                    "The trash bin is clearly visible and the reason matches the report."
            );
        } else {
            return new AiReportResult(
                    false,
                    false,
                    0.10,
                    "The trash bin is not visible or the reason does not match the report."
            );
        }

    }
}
