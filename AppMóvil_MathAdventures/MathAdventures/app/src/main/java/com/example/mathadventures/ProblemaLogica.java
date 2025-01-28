package com.example.mathadventures;

public class ProblemaLogica {
    private String enunciado;
    private int[] opciones;
    private int respuestaCorrecta;

    public ProblemaLogica(String enunciado, int[] opciones, int respuestaCorrecta) {
        this.enunciado = enunciado;
        this.opciones = opciones;
        this.respuestaCorrecta = respuestaCorrecta;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public int[] getOpciones() {
        return opciones;
    }

    public int getRespuestaCorrecta() {
        return respuestaCorrecta;
    }
}
