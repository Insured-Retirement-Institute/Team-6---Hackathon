package com.demo.producerlna.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProducerLNAResponse {

    @JsonProperty("code")
    private Integer code;

    @JsonProperty("description")
    private String description;
}
