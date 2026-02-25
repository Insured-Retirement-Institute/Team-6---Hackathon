package com.demo.producerlna.exception;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {

    @JsonProperty("code")
    private int code;

    @JsonProperty("description")
    private String description;

    @JsonProperty("errors")
    private List<FieldError> errors;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldError {

        @JsonProperty("field")
        private String field;

        @JsonProperty("issue")
        private String issue;
    }
}
