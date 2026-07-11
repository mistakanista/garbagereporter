package com.schulmeister.garbagereporter.trashbin;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrashbinRequest {

    private Long number;

    private String type;

    private String location;

    private String street;

    private String houseNumber;

    private String zip;

    private String city;

    private BigDecimal latitude;

    private BigDecimal longitude;

}
