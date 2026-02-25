	package com.demo.producercheck.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProducerResponse {

    private MessageInformationResponse messageInformation;

    private List<ProducerItemResponse> eligibilityDetails;
}
