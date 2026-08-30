package com.schulmeister.garbagereporter.report.ai;

import com.schulmeister.garbagereporter.report.Report;

public interface AiReportService {
    AiReportResult analyze(Report report);
}
