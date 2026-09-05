package com.schulmeister.garbagereporter.report;

public enum Status {
    NEW("new"),
    CONFIRMED("confirmed"),
    PLANNED("planned"),
    DONE("done"),
    OBSOLETE("obsolete");

    private final String statusValue;

    Status(String status) {
        this.statusValue = status;
    }

    public String getStatusValue() {
        return statusValue;
    }
}
