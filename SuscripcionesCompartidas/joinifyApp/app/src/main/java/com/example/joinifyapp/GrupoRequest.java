package com.example.joinifyapp;

public class GrupoRequest {
    private String name;
    private String serviceType;
    private int maxUsers;
    private double costPerUser;
    private String paymentPolicy;
    private int userId;

    public GrupoRequest(String name, String serviceType, int maxUsers, double costPerUser, String paymentPolicy, int userId) {
        this.name = name;
        this.serviceType = serviceType;
        this.maxUsers = maxUsers;
        this.costPerUser = costPerUser;
        this.paymentPolicy = paymentPolicy;
        this.userId = userId;
    }


}
