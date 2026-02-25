package com.demo.producercheck.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AgentInfo {

    private String contractNumber;

    @Pattern(
        regexp = "PA|RM|TM|H1|BG|RA|HA",
        message = "roleCode must be one of: PA, RM, TM, H1, BG, RA, HA"
    )
    private String roleCode;

    @NotBlank(message = "npn is required")
    private String npn;
}
