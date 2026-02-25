package com.demo.producerlna.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.producerlna.dto.ProducerLNARequest;
import com.demo.producerlna.dto.ProducerLNAResponse;
import com.demo.producerlna.service.ProducerLnaService;

@Slf4j
@RestController
@RequestMapping("/v1/producer")
@RequiredArgsConstructor
@Tag(name = "Producer LNA", description = "Producer License and Appointment onboarding operations")
public class ProducerLnaController {

    private final ProducerLnaService producerLnaService;

    @PostMapping(
            value = "/lna",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(
            operationId = "postProducerOnboard",
            summary = "Perform Producer LNA",
            description = "Submit a Producer License and Appointment onboarding request"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success",
                    content = @Content(schema = @Schema(implementation = ProducerLNAResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content(schema = @Schema(implementation = com.demo.producerlna.exception.ApiError.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not Found"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error",
                    content = @Content(schema = @Schema(implementation = com.demo.producerlna.exception.ApiError.class))),
            @ApiResponse(responseCode = "503", description = "Service Unavailable")
    })
    public ResponseEntity<ProducerLNAResponse> postProducerLna(
            @Valid @RequestBody ProducerLNARequest request) {

        log.debug("Received LNA request for NPN={}", request.getProducer().getNpn());
        ProducerLNAResponse response = producerLnaService.processLna(request);
        return ResponseEntity.ok(response);
    }
}
