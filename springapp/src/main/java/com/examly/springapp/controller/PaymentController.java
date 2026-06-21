package com.examly.springapp.controller;

import com.examly.springapp.model.Payment;
import com.examly.springapp.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {
  "https://8081-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "https://8080-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "http://localhost:8081",
  "http://localhost:3000"
})

public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment);
    }

    @PutMapping("/{id}/status")
    public Payment updatePaymentStatus(@PathVariable Long id, @RequestParam String status, @RequestParam String transactionId) {
        return paymentService.updatePaymentStatus(id, status, transactionId);
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(@PathVariable Long userId) {
        return paymentService.getPaymentsByUserId(userId);
    }

    @GetMapping("/booking/{bookingId}")
    public List<Payment> getPaymentsByBookingId(@PathVariable Long bookingId) {
        return paymentService.getPaymentsByBookingId(bookingId);
    }

    @GetMapping("/transaction/{transactionId}")
    public Payment getPaymentByTransactionId(@PathVariable String transactionId) {
        return paymentService.getPaymentByTransactionId(transactionId);
    }

    @GetMapping("/user/{userId}/total")
    public Double getTotalPaidByUser(@PathVariable Long userId) {
        return paymentService.getTotalPaidByUser(userId);
    }

    @PutMapping("/{id}/refund")
    public Payment refundPayment(@PathVariable Long id) {
        return paymentService.refundPayment(id);
    }
}