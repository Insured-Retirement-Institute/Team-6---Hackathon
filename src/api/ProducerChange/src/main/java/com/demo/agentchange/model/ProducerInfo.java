package com.demo.agentchange.model;

import lombok.Data;
import java.util.List;

@Data
public class ProducerInfo {

    private List<Producers> from;
    private List<Producers> to;
}
