package com.example.mathadventures;

public class EjercicioSecuencia {
    private String pregunta;
    private int[] secuencia;       // La secuencia con espacios en blanco representados por -1
    private int[] opciones;        // Opciones para completar los espacios en blanco
    private int[] respuestasCorrectas; // Respuestas correctas en orden para los espacios en blanco

    public EjercicioSecuencia(String pregunta, int[] secuencia, int[] opciones, int[] respuestasCorrectas) {
        this.pregunta = pregunta;
        this.secuencia = secuencia;
        this.opciones = opciones;
        this.respuestasCorrectas = respuestasCorrectas;
    }

    public String getPregunta() {
        return pregunta;
    }

    public int[] getSecuencia() {
        return secuencia;
    }

    public int[] getOpciones() {
        return opciones;
    }

    public int[] getRespuestasCorrectas() {
        return respuestasCorrectas;
    }
}
