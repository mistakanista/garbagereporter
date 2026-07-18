package com.schulmeister.garbagereporter.report;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportRequest {

    private Long trashbinId;

    private String type;

    private String image;

    private String description;

}
