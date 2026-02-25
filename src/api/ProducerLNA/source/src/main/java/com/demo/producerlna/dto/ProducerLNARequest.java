package com.demo.producerlna.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProducerLNARequest {

    @NotNull
    @Valid
    @JsonProperty("organization")
    private Organization organization;

    @NotNull
    @Valid
    @JsonProperty("producer")
    private Producer producer;

    @NotNull
    @Valid
    @JsonProperty("hierarchies")
    private Hierarchies hierarchies;

    @NotNull
    @Valid
    @JsonProperty("request_details")
    private RequestDetails requestDetails;
}
