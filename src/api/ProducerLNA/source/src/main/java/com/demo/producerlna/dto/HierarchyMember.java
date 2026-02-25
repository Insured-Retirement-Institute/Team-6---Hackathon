package com.demo.producerlna.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HierarchyMember {

    @NotBlank
    @JsonProperty("name")
    private String name;

    @NotBlank
    @JsonProperty("nipr")
    private String nipr;

    @NotNull
    @JsonProperty("hierarchy_type")
    private HierarchyType hierarchyType;

    @NotBlank
    @JsonProperty("producer_code")
    private String producerCode;

    @NotBlank
    @JsonProperty("compensation_level")
    private String compensationLevel;

    // ------------------------------------------------------------------ enum

    public enum HierarchyType {
        PRODUCER("producer"),
        DIRECT_UPLINE("direct_upline"),
        UPLINE("upline"),
        GA("ga"),
        MGA("mga");

        private final String value;
        HierarchyType(String value) { this.value = value; }

        @JsonValue
        public String getValue() { return value; }
    }
}
