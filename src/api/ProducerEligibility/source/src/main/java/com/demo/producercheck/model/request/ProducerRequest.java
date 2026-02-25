package com.demo.producercheck.model.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ProducerRequest {

    @NotNull(message = "messageInformation is required")
    @Valid
    private MessageInformation messageInformation;

    @NotEmpty(message = "agentInfo is required and must not be empty")
    @Valid
    private List<AgentInfo> agentInfo;
}
