package com.demo.producercheck.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(Include.NON_NULL)
public class ProducerItemResponse {

    // From producerNameResponse
    private String npn;

    // From partyRole
    private String roleCode;

    // From StatusInfo
    private String status;

    // From producerStatus — optional errors
    private List<ProducerStatusError> errors;
}
