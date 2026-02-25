package com.demo.agentchange.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleCode {

    PA("PA"),
    RM("RM"),
    TM("TM"),
    H1("H1"),
    BG("BG"),
    RA("RA"),
    HA("HA");

    private final String value;

    RoleCode(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
