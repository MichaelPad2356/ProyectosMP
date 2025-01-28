
package com.example.mathadventures;

public class ProblemaFraccion {
    private String pregunta;
    private int imagenResourceId;
    private String[] opciones;
    private String respuestaCorrecta;

    public ProblemaFraccion(String pregunta, int imagenResourceId, String[] opciones, String respuestaCorrecta) {
        this.pregunta = pregunta;
        this.imagenResourceId = imagenResourceId;
        this.opciones = opciones;
        this.respuestaCorrecta = respuestaCorrecta;
    }

    public String getPregunta() {
        return pregunta;
    }

    public int getImagenResourceId() {
        return imagenResourceId;
    }

    public String[] getOpciones() {
        return opciones;
    }

    public String getRespuestaCorrecta() {
        return respuestaCorrecta;
    }


}
