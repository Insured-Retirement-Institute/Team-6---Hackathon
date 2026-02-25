package com.demo.producercheck.controller;

import com.demo.producercheck.exception.UnauthorizedException;
import com.demo.producercheck.model.request.ProducerRequest;
import com.demo.producercheck.model.response.ProducerResponse;
import com.demo.producercheck.service.ProducerCheckService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProducerCheckController {

    private final ProducerCheckService service;

    public ProducerCheckController(ProducerCheckService service) {
        this.service = service;
    }

    /**
     * POST /v1/producer/check
     * Performs producer eligibility check.
     * Requires: Authorization: Bearer <token>
     */
    @PostMapping("/v1/producer/eligibility")
    public ResponseEntity<ProducerResponse> checkEligibility(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @Valid @RequestBody ProducerRequest request) {

        validateBearerToken(authHeader);

        ProducerResponse response = service.checkEligibility(request);
        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────
    // DEMO ENDPOINTS
    // ─────────────────────────────────────────

    /**
     * GET /demo/request
     * Returns a sample POST request body.
     */
    @GetMapping("/demo/request")
    public ResponseEntity<Object> demoRequest() {
        return ResponseEntity.ok(service.getMockRequestExample());
    }

    /**
     * GET /demo/response
     * Returns a sample success response.
     */
    @GetMapping("/demo/response")
    public ResponseEntity<ProducerResponse> demoResponse() {
        return ResponseEntity.ok(service.getMockResponseExample());
    }

    /**
     * GET /demo/errors
     * Returns sample error response shapes.
     */
    @GetMapping("/demo/errors")
    public ResponseEntity<Object> demoErrors() {
        return ResponseEntity.ok(java.util.Map.of(
                "description", "Sample error responses by HTTP status code",
                "errors", java.util.Map.of(
                        "400 Bad Request",   java.util.List.of(java.util.Map.of("code", 400, "description", "Bad Request: malformed or missing required fields.")),
                        "401 Unauthorized",  java.util.List.of(java.util.Map.of("code", 401, "description", "Unauthorized: missing or invalid Bearer token.")),
                        "403 Forbidden",     java.util.List.of(java.util.Map.of("code", 403, "description", "Forbidden: you do not have permission to access this resource.")),
                        "404 Not Found",     java.util.List.of(java.util.Map.of("code", 404, "description", "Not Found: the requested resource could not be found.")),
                        "500 Internal Error",java.util.List.of(java.util.Map.of("code", 500, "description", "Internal Server Error: an unexpected error occurred.")),
                        "503 Unavailable",   java.util.List.of(java.util.Map.of("code", 503, "description", "Service Unavailable: the server is temporarily unable to handle the request."))
                )
        ));
    }

    // ─────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────

    private void validateBearerToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.substring(7).isBlank()) {
            throw new UnauthorizedException("Unauthorized: missing or invalid Bearer token.");
        }
    }
}
