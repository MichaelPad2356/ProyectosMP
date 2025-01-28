package com.example.joinifyapp;

public class SuscripcionRequest {
    private String tipoServicio;
    private double costo;
    private String disponibilidad;
    private int groupId;

    // Constructor
    public SuscripcionRequest(String tipoServicio, double costo, String disponibilidad, int groupId) {
        this.tipoServicio = tipoServicio;
        this.costo = costo;
        this.disponibilidad = disponibilidad;
        this.groupId = groupId;
    }

    // Getters and Setters
    public String getTipoServicio() { return tipoServicio; }
    public void setTipoServicio(String tipoServicio) { this.tipoServicio = tipoServicio; }

    public double getCosto() { return costo; }
    public void setCosto(double costo) { this.costo = costo; }

    public String getDisponibilidad() { return disponibilidad; }
    public void setDisponibilidad(String disponibilidad) { this.disponibilidad = disponibilidad; }

    public int getGroupId() { return groupId; }
    public void setGroupId(int groupId) { this.groupId = groupId; }
}
