package com.example.joinifyapp;

public class Grupo {
    private long id; // Cambiado de int a long
    private String name;
    private int currentUsers;
    private int maxUsers;
    private String serviceType;
    private String paymentPolicy;
    private int costPerUser;

    // Constructor
    public Grupo(long id, String name, int currentUsers, int maxUsers, String serviceType, String paymentPolicy, int costPerUser) {
        this.id = id;
        this.name = name;
        this.currentUsers = currentUsers;
        this.maxUsers = maxUsers;
        this.serviceType = serviceType;
        this.paymentPolicy = paymentPolicy;
        this.costPerUser = costPerUser;
    }

    // Getter para id
    public long getId() {
        return id;
    }

    // Getters para otros campos
    public String getName() {
        return name;
    }

    public int getCurrentUsers() {
        return currentUsers;
    }

    public int getMaxUsers() {
        return maxUsers;
    }

    public String getServiceType() {
        return serviceType;
    }

    public String getPaymentPolicy(){ return paymentPolicy; }

    public int getCostPerUser() { return costPerUser; }
}
