package com.example.mathadventures;

import java.util.ArrayList;

public class ProblemaMultiplicacion {
    private String pregunta;
    private ArrayList<Integer> opciones;
    private int factor1;
    private int factor2;

    public ProblemaMultiplicacion(String pregunta, ArrayList<Integer> opciones, int factor1, int factor2) {
        this.pregunta = pregunta;
        this.opciones = opciones;
        this.factor1 = factor1;
        this.factor2 = factor2;
    }

    public String getPregunta() {
        return pregunta;
    }

    public ArrayList<Integer> getOpciones() {
        return opciones;
    }

    public int getFactor1() {
        return factor1;
    }

    public int getFactor2() {
        return factor2;
    }
}
