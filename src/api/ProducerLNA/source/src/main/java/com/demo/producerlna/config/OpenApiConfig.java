package com.demo.producerlna.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI producerLnaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Producer LNA")
                        .version("1.0.0")
                        .description("Producer License and Appointment Onboarding API")
                        .license(new License()
                                .name("Internal")
                                .url("https://github.com/testing")));
    }
}
