package com.example.mathadventures;

public class EjercicioMultiplicacion {
    private String pregunta;
    private String[] opciones;
    private int indiceRespuestaCorrecta;

    public EjercicioMultiplicacion(String pregunta, String[] opciones, int indiceRespuestaCorrecta) {
        this.pregunta = pregunta;
        this.opciones = opciones;
        this.indiceRespuestaCorrecta = indiceRespuestaCorrecta;
    }

    public String getPregunta() {
        return pregunta;
    }

    public String[] getOpciones() {
        return opciones;
    }

    public int getIndiceRespuestaCorrecta() {
        return indiceRespuestaCorrecta;
    }
}
