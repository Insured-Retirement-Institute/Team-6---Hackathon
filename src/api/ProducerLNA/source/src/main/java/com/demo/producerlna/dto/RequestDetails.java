package com.demo.producerlna.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDetails {

    @NotBlank
    @JsonProperty("group")
    private String group;

    @NotBlank
    @JsonProperty("request_id")
    private String requestId;

    @NotBlank
    @JsonProperty("carrier_name")
    private String carrierName;

    @NotNull
    @JsonProperty("request_type")
    private RequestType requestType;

    @JsonProperty("request_sub_type")
    private String requestSubType;

    @JsonProperty("created_date")
    private OffsetDateTime createdDate;

    @JsonProperty("submitted_date")
    private OffsetDateTime submittedDate;

    @NotNull
    @JsonProperty("request_status")
    private RequestStatus requestStatus;

    @JsonProperty("digitaly_signed_at")
    private OffsetDateTime digitalySignedAt;

    // ------------------------------------------------------------------ enums

    public enum RequestType {
        NEW_CONTRACT("new_contract"),
        CONTRACT_CHANGE("contract_change"),
        TERMINATION("termination");

        private final String value;
        RequestType(String value) { this.value = value; }

        @JsonValue
        public String getValue() { return value; }
    }

    public enum RequestStatus {
        PENDING("pending"),
        SUBMITTED("submitted"),
        UNDER_REVIEW("under_review"),
        CORPORATE_APPROVED("corporate_approved"),
        CORPORATE_REJECTED("corporate_rejected"),
        CANCELLED("cancelled");

        private final String value;
        RequestStatus(String value) { this.value = value; }

        @JsonValue
        public String getValue() { return value; }
    }
}
