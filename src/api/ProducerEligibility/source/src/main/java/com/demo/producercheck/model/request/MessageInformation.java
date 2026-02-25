package com.demo.producercheck.model.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MessageInformation {

    @NotBlank(message = "sender is required")
    private String sender;

    @NotBlank(message = "receiver is required")
    private String receiver;

    @NotBlank(message = "trackingNumber is required")
    private String trackingNumber;
}
