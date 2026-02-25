package com.demo.producerlna.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Producer {

    @NotNull
    @JsonProperty("type")
    private ProducerType type;

    @NotBlank
    @JsonProperty("npn")
    private String npn;

    @JsonProperty("loa")
    private String loa;

    @JsonProperty("salutation")
    private Salutation salutation;

    @JsonProperty("suffix")
    private String suffix;

    @JsonProperty("gender")
    private Gender gender;

    @NotBlank
    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("middle_name")
    private String middleName;

    @NotBlank
    @JsonProperty("last_name")
    private String lastName;

    @NotBlank
    @Size(min = 2, max = 2)
    @JsonProperty("residence_state")
    private String residenceState;

    @NotBlank
    @JsonProperty("date_of_birth")
    private String dateOfBirth;

    @JsonProperty("business_name")
    private String businessName;

    @NotBlank
    @JsonProperty("tax_identification_number")
    private String taxIdentificationNumber;

    @NotNull
    @JsonProperty("identification_type")
    private IdentificationType identificationType;

    @NotBlank
    @JsonProperty("resident_license_number")
    private String residentLicenseNumber;

    @JsonProperty("created_date")
    private OffsetDateTime createdDate;

    @JsonProperty("last_nipr_updated_at")
    private OffsetDateTime lastNiprUpdatedAt;

    // ------------------------------------------------------------------ enums

    public enum ProducerType {
        INDIVIDUAL("individual"),
        BUSINESS("business");

        private final String value;
        ProducerType(String value) { this.value = value; }

        @JsonValue
        public String getValue() { return value; }
    }

    public enum Salutation {
        MR("mr"), MRS("mrs"), MS("ms"), DR("dr"), PROF("prof");

        private final String value;
        Salutation(String value) { this.value = value; }

        @JsonValue
        public String getValue() { return value; }
    }

    public enum Gender {
        MALE("male"),
        FEMALE("female"),
        NON_BINARY("non_binary"),
        PREFER_NOT_TO_SAY("prefer_not_to_say");

        private final String value;
        Gender(String value) { this.value = value; }

        @JsonValue
        public String getValue() { return value; }
    }

    public enum IdentificationType {
        SSN("ssn"),
        EIN("ein");

        private final String value;
        IdentificationType(String value) { this.value = value; }

        @JsonValue
        public String getValue() { return value; }
    }
}
