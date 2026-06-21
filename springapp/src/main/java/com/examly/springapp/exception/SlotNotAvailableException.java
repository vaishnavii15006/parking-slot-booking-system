package com.examly.springapp.exception;

public class SlotNotAvailableException extends Exception {

    public SlotNotAvailableException() {
        super("Slot not found");
    }

    public SlotNotAvailableException(String message) {
        super(message);
    }
}