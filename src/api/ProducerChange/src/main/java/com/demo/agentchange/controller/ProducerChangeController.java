package com.demo.agentchange.controller;

import com.demo.agentchange.model.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/producer")
@Tag(name = "Producer Contract Change", description = "Producer Change Service")
public class ProducerChangeController {

    @Operation(
        operationId = "postProducerChange",
        summary = "Perform Producer Change (AOR)",
        description = "Perform Producer Record of Change"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Response",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ProduerResponse.class))),
        @ApiResponse(responseCode = "400", description = "BadRequest",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "403", description = "Forbidden",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "404", description = "NotFound",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "500", description = "InternalServerError",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "503", description = "ServiceUnavailable",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping(
        value = "/contractchange",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ProduerResponse> postProducerChange(@RequestBody ProducerRequest request) {

       
        if (request == null
                || request.getMessageInformation() == null
                || request.getProducerInfo() == null) {
            return ResponseEntity.badRequest().build();
        }

        
        ProduerResponse mockResponse = buildMockResponse(request);
        return ResponseEntity.ok(mockResponse);
    }

    
    private ProduerResponse buildMockResponse(ProducerRequest request) {
        String trackingNumber = request.getMessageInformation() != null
                ? request.getMessageInformation().getTrackingNumber()
                : "UNKNOWN";

        return new ProduerResponse(
                200,
                "Producer change request accepted for tracking number: " + trackingNumber
        );
    }

    // ── Mock request example (accessible via GET for demo)
    @GetMapping("/contractchange/mock-request")
    @Operation(summary = "Returns a sample Producer Contract Change Request payload for demo purposes")
    public ResponseEntity<ProducerRequest> getMockRequest() {

        MessageInformation msgInfo = new MessageInformation();
      
        msgInfo.setSender("SYSTEM_A");
        msgInfo.setReceiver("SYSTEM_B");
        msgInfo.setTrackingNumber("TRK-2026-0001");

        Producers fromAgent = new Producers();
        fromAgent.setContractNumber("C-10001");
        fromAgent.setNpn("NPN-55501");
        fromAgent.setSplit("50");
        fromAgent.setRoleCode(RoleCode.PA);

        Producers toAgent = new Producers();
        toAgent.setContractNumber("C-20002");
        toAgent.setNpn("NPN-66602");
        toAgent.setSplit("50");
        toAgent.setRoleCode(RoleCode.RM);

        ProducerInfo agentInfo = new ProducerInfo();
        agentInfo.setFrom(List.of(fromAgent));
        agentInfo.setTo(List.of(toAgent));

        ProducerRequest mockRequest = new ProducerRequest();
        mockRequest.setMessageInformation(msgInfo);
        mockRequest.setProducerInfo(agentInfo);

        return ResponseEntity.ok(mockRequest);
    }
}
