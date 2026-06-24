package com.schulmeister.barcamp.topics;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopicUpdateRequest {

    private Long id;

    private String title;
    
    private String name;

    private String description;

    private String categories;

}
