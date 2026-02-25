package com.demo.producerlna.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductHierarchy {

    @NotBlank
    @JsonProperty("product_name")
    private String productName;

    @NotBlank
    @JsonProperty("product_type")
    private String productType;

    @NotBlank
    @JsonProperty("comp_level")
    private String compLevel;

    @NotNull
    @Size(min = 1)
    @Valid
    @JsonProperty("states")
    private List<StateEntry> states;

    @NotNull
    @Size(min = 1)
    @Valid
    @JsonProperty("hirerachy")
    private List<HierarchyMember> hirerachy;
}
