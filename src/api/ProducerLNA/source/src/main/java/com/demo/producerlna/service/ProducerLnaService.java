package com.demo.producerlna.service;

import com.demo.producerlna.dto.ProducerLNARequest;
import com.demo.producerlna.dto.ProducerLNAResponse;

public interface ProducerLnaService {

    /**
     * Processes a Producer LNA (License and Appointment) onboarding request.
     *
     * @param request the validated incoming request payload
     * @return a {@link ProducerLNAResponse} confirming the outcome
     */
    ProducerLNAResponse processLna(ProducerLNARequest request);
}
