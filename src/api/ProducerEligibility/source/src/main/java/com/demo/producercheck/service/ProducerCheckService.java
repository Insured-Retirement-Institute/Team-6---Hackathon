package com.demo.producercheck.service;

import com.demo.producercheck.model.request.AgentInfo;
import com.demo.producercheck.model.request.ProducerRequest;
import com.demo.producercheck.model.response.MessageInformationResponse;
import com.demo.producercheck.model.response.ProducerItemResponse;
import com.demo.producercheck.model.response.ProducerResponse;
import com.demo.producercheck.model.response.ProducerStatusError;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProducerCheckService {

    /**
     * Processes the producer eligibility check request and returns response.
     * 
     */
    public ProducerResponse checkEligibility(ProducerRequest request) {

        List<ProducerItemResponse> responseList = new ArrayList<>();

        List<AgentInfo> agents = request.getAgentInfo();
        for (int i = 0; i < agents.size(); i++) {
            AgentInfo agent = agents.get(i);
            boolean eligible = (i % 2 == 0); // Every other agent is ineligible 
            if(agent.getNpn().equalsIgnoreCase("7654321"))
            {
            	eligible = false;
            }
            ProducerItemResponse.ProducerItemResponseBuilder itemBuilder = ProducerItemResponse.builder()
                    .npn(agent.getNpn())
                    .roleCode(agent.getRoleCode())
                    .status(eligible ? "ELIGIBLE" : "INELIGIBLE");

            if (!eligible) {
                itemBuilder.errors(List.of(
                        ProducerStatusError.builder()
                                .errorCode("050" + (i + 1))
                                .errorDescription("License and Appointment Not Found")
                                .build()
                ));
            }

            responseList.add(itemBuilder.build());
        }

        MessageInformationResponse msgInfo = MessageInformationResponse.builder()
           
                .sender(request.getMessageInformation().getReceiver())
                .receiver(request.getMessageInformation().getSender())
                .trackingNumber(request.getMessageInformation().getTrackingNumber())
                .build();

        return ProducerResponse.builder()
                .messageInformation(msgInfo)
                .eligibilityDetails(responseList)
                .build();
    }

    /**
     * Returns a hardcoded mock request example for the demo endpoint.
     */
    public Object getMockRequestExample() {
        return java.util.Map.of(
                "description", "Sample POST body for POST /v1/producer/eligibility",
                "headers", java.util.Map.of(
                        "Content-Type", "application/json",
                        "Authorization", "Bearer <your-jwt-token>"
                ),
                "body", java.util.Map.of(
                        "messageInformation", java.util.Map.of(
                               
                                "sender", "JPMChase",
                                "receiver", "Corebridge",
                                "trackingNumber", "TRK-20260224-001"
                        ),
                        "agentInfo", List.of(
                                java.util.Map.of("contractNumber", "CONT10001", "roleCode", "PA", "npn", "1234567"),
                                java.util.Map.of("contractNumber", "CONT10002", "roleCode", "RM", "npn", "7654321")
                        )
                )
        );
    }

    /**
     * Returns a hardcoded mock success response for the demo endpoint.
     */
    public ProducerResponse getMockResponseExample() {
        return ProducerResponse.builder()
                .messageInformation(MessageInformationResponse.builder()
                        
                        .sender("JPMChase")
                        .receiver("Corebridge")
                        .trackingNumber("TRK-20260224-001")
                        .build())
                .eligibilityDetails(List.of(
                        ProducerItemResponse.builder()
                                .npn("1234567")
                                .roleCode("PA")
                                .status("ELIGIBLE")
                                .build(),
                        ProducerItemResponse.builder()
                                .npn("7654321")
                                .roleCode("RM")
                                .status("INELIGIBLE")
                                .errors(List.of(
                                        ProducerStatusError.builder()
                                                .errorCode("050")
                                                .errorDescription("License Not Found")
                                                .build()
                                ))
                                .build()
                ))
                .build();
    }
}
