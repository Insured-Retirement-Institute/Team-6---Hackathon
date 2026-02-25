package com.demo.producerlna.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.demo.producerlna.dto.ProducerLNARequest;
import com.demo.producerlna.dto.ProducerLNAResponse;
import com.demo.producerlna.service.ProducerLnaService;

@Slf4j
@Service
public class ProducerLnaServiceImpl implements ProducerLnaService {

    @Override
    public ProducerLNAResponse processLna(ProducerLNARequest request) {
        log.info("Processing LNA for producer NPN={} requestId={}",
                request.getProducer().getNpn(),
                request.getRequestDetails().getRequestId());

        
        return ProducerLNAResponse.builder()
                .code(200)
                .description("Producer LNA request accepted successfully")
                .build();
    }
}
