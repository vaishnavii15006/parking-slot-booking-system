package com.examly.springapp.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException e) {
        return buildResponse(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SlotNotAvailableException.class)
    public ResponseEntity<Object> handleSlotNotAvailable(SlotNotAvailableException e) {
        return buildResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BookingValidationException.class)
    public ResponseEntity<Object> handleBookingValidation(BookingValidationException e) {
        return buildResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception e) {
        if (e.getClass().getName().contains("NoHandlerFoundException") || e.getClass().getName().contains("Servlet"))
            throw new RuntimeException(e);
        return buildResponse("Something went wrong: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Object> buildResponse(String message, HttpStatus status) {
        Map<String, String> errormap = new HashMap<>();
        errormap.put("message", message);
        return new ResponseEntity<>(errormap, status);
    }
}
