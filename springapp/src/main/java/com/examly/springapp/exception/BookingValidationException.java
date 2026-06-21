package com.examly.springapp.exception;

public class BookingValidationException extends Exception {
    public BookingValidationException() {
        super("Slot Already booked");
    }

    public BookingValidationException(String m) {
        super(m);
    }
}
