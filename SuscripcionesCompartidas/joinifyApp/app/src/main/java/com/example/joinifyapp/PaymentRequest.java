package com.example.joinifyapp;

public class PaymentRequest {
    private int userId;
    private int groupId;
    private double amount;
    private String paymentMethodId;

    public PaymentRequest(int userId, int groupId, double amount, String paymentMethodId) {
        this.userId = userId;
        this.groupId = groupId;
        this.amount = amount;
        this.paymentMethodId = paymentMethodId;
    }


}
