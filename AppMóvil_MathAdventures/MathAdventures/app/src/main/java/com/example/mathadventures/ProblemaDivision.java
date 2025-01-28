package com.example.mathadventures;


public class ProblemaDivision {
    private String pregunta;
    private String[] opciones;
    private String respuestaCorrecta;

    public ProblemaDivision(String pregunta, String[] opciones, String respuestaCorrecta) {
        this.pregunta = pregunta;
        this.opciones = opciones;
        this.respuestaCorrecta = respuestaCorrecta;
    }

    public String getPregunta() {
        return pregunta;
    }

    public String[] getOpciones() {
        return opciones;
    }

    public String getRespuestaCorrecta() {
        return respuestaCorrecta;
    }
}

