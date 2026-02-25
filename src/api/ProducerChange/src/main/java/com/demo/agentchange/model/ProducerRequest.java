package com.demo.agentchange.model;

import lombok.Data;

@Data
public class ProducerRequest {

    private MessageInformation messageInformation;
    private ProducerInfo producerInfo;
}
