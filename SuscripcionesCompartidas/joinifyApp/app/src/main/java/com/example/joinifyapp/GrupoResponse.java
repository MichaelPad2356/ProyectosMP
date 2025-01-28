package com.example.joinifyapp;

public class GrupoResponse {
    private int id; // Cambiar a long para aceptar IDs más grandes
    private String name;
    private String serviceType;
    private int maxUsers;
    private int currentUsers;
    private int costPerUser;
    private String paymentPolicy;
    private String createdAt;
    private String joinedAt;

    // Getters y setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public int getMaxUsers() { return maxUsers; }
    public void setMaxUsers(int maxUsers) { this.maxUsers = maxUsers; }

    public int getCurrentUsers() { return currentUsers; }
    public void setCurrentUsers(int currentUsers) { this.currentUsers = currentUsers; }

    public int getCostPerUser() { return costPerUser; }
    public void setCostPerUser(int costPerUser) { this.costPerUser = costPerUser; }

    public String getPaymentPolicy() { return paymentPolicy; }
    public void setPaymentPolicy(String paymentPolicy) { this.paymentPolicy = paymentPolicy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getJoinedAt() { return joinedAt; }
    public void setJoinedAt(String joinedAt) { this.joinedAt = joinedAt; }
}
