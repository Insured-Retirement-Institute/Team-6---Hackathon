package com.demo.producerlna.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles Bean Validation failures (@Valid).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<ApiError>> handleValidationException(
            MethodArgumentNotValidException ex) {

        List<ApiError.FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> ApiError.FieldError.builder()
                        .field(fe.getField())
                        .issue(fe.getDefaultMessage())
                        .build())
                .toList();

        ApiError error = ApiError.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .description("Request validation failed")
                .errors(fieldErrors)
                .build();

        log.warn("Validation error: {}", fieldErrors);
        return ResponseEntity.badRequest().body(List.of(error));
    }

    /**
     * Handles illegal argument / bad input at the service level.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<List<ApiError>> handleIllegalArgument(
            IllegalArgumentException ex) {

        ApiError error = ApiError.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .description(ex.getMessage())
                .build();

        log.warn("Illegal argument: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(List.of(error));
    }

    /**
     * Catch-all handler.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<List<ApiError>> handleGeneric(Exception ex) {

        ApiError error = ApiError.builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .description("An unexpected error occurred")
                .build();

        log.error("Unhandled exception", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of(error));
    }
}
