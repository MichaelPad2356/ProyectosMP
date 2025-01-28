package com.example.mathadventures;

public class EjercicioDivision {
    private String pregunta;
    private int numeroObjetos;
    private int numeroGrupos;

    public EjercicioDivision(String pregunta, int numeroObjetos, int numeroGrupos) {
        this.pregunta = pregunta;
        this.numeroObjetos = numeroObjetos;
        this.numeroGrupos = numeroGrupos;
    }

    public String getPregunta() {
        return pregunta;
    }

    public int getNumeroObjetos() {
        return numeroObjetos;
    }

    public int getNumeroGrupos() {
        return numeroGrupos;
    }

    public int getObjetosPorGrupo() {
        return numeroObjetos / numeroGrupos;
    }
}
