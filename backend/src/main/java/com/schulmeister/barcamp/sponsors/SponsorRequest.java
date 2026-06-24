package com.schulmeister.barcamp.sponsors;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SponsorRequest {

    private String name;

    private String email;

    private String company;

    private String logo;

    private String level;

    private Integer sort;

    private String link;

}
