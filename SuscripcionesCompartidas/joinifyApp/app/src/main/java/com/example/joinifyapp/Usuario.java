package com.example.joinifyapp;

public class Usuario {
    private String fullname;
    private String email;
    private String password;


    public Usuario(String fullname, String email, String password) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
    }

    // Getters y Setters
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

}
