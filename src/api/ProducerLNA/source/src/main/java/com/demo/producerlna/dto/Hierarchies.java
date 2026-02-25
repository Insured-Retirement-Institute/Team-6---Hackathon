package com.demo.producerlna.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hierarchies {

    @Valid
    @JsonProperty("new")
    private HierarchyGroup newGroup;

    @Valid
    @JsonProperty("existing")
    private HierarchyGroup existingGroup;
}
