package com.schulmeister.garbagereporter.report.ai;


public record AiReportResult(
        boolean trashBinDetected,
        boolean reasonMatches,
        double confidence,
        String explanation
) {
}
