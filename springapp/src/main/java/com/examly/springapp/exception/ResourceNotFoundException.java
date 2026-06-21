package com.examly.springapp.exception;

public class ResourceNotFoundException extends Exception {
    public ResourceNotFoundException() {
        super();
    }

    public ResourceNotFoundException(String m) {
        super(m);
    }
}
