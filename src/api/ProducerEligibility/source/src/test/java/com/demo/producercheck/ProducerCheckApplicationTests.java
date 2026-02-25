package com.demo.producercheck;

import com.demo.producercheck.model.request.AgentInfo;
import com.demo.producercheck.model.request.MessageInformation;
import com.demo.producercheck.model.request.ProducerRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProducerCheckApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ─── Helper ───────────────────────────────

    private ProducerRequest buildValidRequest() {
        MessageInformation msgInfo = new MessageInformation();
       
        msgInfo.setSender("CLIENT-SYS-001");
        msgInfo.setReceiver("ELIGIBILITY-SVC");
        msgInfo.setTrackingNumber("TRK-20260224-001");

        AgentInfo agent1 = new AgentInfo();
        agent1.setContractNumber("CONT-10001");
        agent1.setRoleCode("PA");
        agent1.setNpn("NPN1234567");

        AgentInfo agent2 = new AgentInfo();
        agent2.setContractNumber("CONT-10002");
        agent2.setRoleCode("RM");
        agent2.setNpn("NPN7654321");

        ProducerRequest request = new ProducerRequest();
        request.setMessageInformation(msgInfo);
        request.setAgentInfo(List.of(agent1, agent2));
        return request;
    }

    // ─── Tests ────────────────────────────────

    @Test
    void postCheck_withValidRequest_returns200() throws Exception {
        mockMvc.perform(post("/v1/producer/eligibility")
                        .header("Authorization", "Bearer demo-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildValidRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messageInformation.trackingNumber").value("TRK-20260224-001"))
                .andExpect(jsonPath("$.eligibilityDetails").isArray())
                .andExpect(jsonPath("$.eligibilityDetails[0].status").value("ELIGIBLE"))
                .andExpect(jsonPath("$.eligibilityDetails[1].status").value("INELIGIBLE"));
    }

    @Test
    void postCheck_missingToken_returns401() throws Exception {
        mockMvc.perform(post("/v1/producer/eligibility")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildValidRequest())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postCheck_missingAgentInfo_returns400() throws Exception {
        ProducerRequest request = buildValidRequest();
        request.setAgentInfo(null);

        mockMvc.perform(post("/v1/producer/eligibility")
                        .header("Authorization", "Bearer demo-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void postCheck_invalidRoleCode_returns400() throws Exception {
        ProducerRequest request = buildValidRequest();
        request.getAgentInfo().get(0).setRoleCode("INVALID");

        mockMvc.perform(post("/v1/producer/eligibility")
                        .header("Authorization", "Bearer demo-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void demoRequest_returns200() throws Exception {
        mockMvc.perform(get("/demo/request"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.body").exists());
    }

    @Test
    void demoResponse_returns200() throws Exception {
        mockMvc.perform(get("/demo/response"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eligibilityDetails").isArray());
    }

    @Test
    void demoErrors_returns200() throws Exception {
        mockMvc.perform(get("/demo/errors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.errors").exists());
    }
}
