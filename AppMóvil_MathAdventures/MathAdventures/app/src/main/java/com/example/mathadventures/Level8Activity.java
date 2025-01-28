package com.example.mathadventures;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.Collections;
import android.widget.GridLayout;
import android.media.MediaPlayer;

public class Level8Activity extends AppCompatActivity {

    private TextView textPregunta, textVagonActual;
    private ImageView trenIcon;
    private GridLayout opcionesContainer;
    private ArrayList<ProblemaDivision> listaProblemas;
    private int problemaActual = 0;
    private int vagonActual = 1;
    private int totalVagones;
    private int[] trenImages = {
            R.drawable.v1,
            R.drawable.v2,
            R.drawable.v3,
            R.drawable.v4,
            R.drawable.v5,
            R.drawable.v6,
            R.drawable.v7,
            R.drawable.v8,
            R.drawable.v9,
            R.drawable.v10
    };
    private ImageView btnBack, btnTips;
    private int nivelActual = 8;
    private int userId;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel8);

        textPregunta = findViewById(R.id.textPregunta);
        textVagonActual = findViewById(R.id.textVagonActual);
        trenIcon = findViewById(R.id.trenIcon);
        opcionesContainer = findViewById(R.id.opcionesContainer);
        btnBack = findViewById(R.id.btnBack);
        btnTips = findViewById(R.id.btnTips);

        // Obtener el ID del usuario desde el Intent
        userId = getIntent().getIntExtra("userId", -1);

        listaProblemas = obtenerProblemas();
        totalVagones = listaProblemas.size();
        mostrarProblema();

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Level8Activity.this, LevelsActivity.class);
                startActivity(intent);
                finish();
            }
        });

        // Clic en el botón de consejos
        btnTips.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAdviceDialog();
            }
        });
    }

    private void showAdviceDialog() {
        // LayoutInflater para inflar el archivo XML del diálogo
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_custom, null);

        // Obtener las vistas del diálogo para personalizar el contenido
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);

        // Texto para el título y el mensaje
        dialogTitle.setText("Consejo - Nivel 8");
        dialogMessage.setText("Recuerda que cada vagón debe llevar una cantidad igual de cajas." +
                              " Divide el número total de cajas entre los vagones disponibles y distribúyelas cuidadosamente." +
                              " Si el número total no se divide exactamente, revisa nuevamente tus cálculos");

        // Crear y configurar el AlertDialog
        AlertDialog.Builder builder = new AlertDialog.Builder(Level8Activity.this);
        builder.setView(dialogView)
               .setCancelable(false); // Evitar que se cierre al tocar fuera del diálogo

        // Crear y mostrar el diálogo
        AlertDialog dialog = builder.create();

        // Fondo personalizado al diálogo
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_background);
        dialog.show();

        // Acción para el botón Aceptar
        btnAccept.setOnClickListener(v -> dialog.dismiss()); // Cerrar el diálogo al hacer clic en Aceptar
    }


    private ArrayList<ProblemaDivision> obtenerProblemas() {
        ArrayList<ProblemaDivision> problemas = new ArrayList<>();
        problemas.add(new ProblemaDivision("Divide 20 cajas en 4 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"5", "6", "4", "3"}, "5"));
        problemas.add(new ProblemaDivision("Divide 30 cajas en 5 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"6", "7", "5", "4"}, "6"));
        problemas.add(new ProblemaDivision("Divide 18 cajas en 3 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"6", "5", "4", "3"}, "6"));
        problemas.add(new ProblemaDivision("Divide 24 cajas en 6 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"4", "5", "6", "3"}, "4"));
        problemas.add(new ProblemaDivision("Divide 32 cajas en 4 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"8", "7", "6", "4"}, "8"));
        problemas.add(new ProblemaDivision("Divide 40 cajas en 8 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"5", "6", "4", "7"}, "5"));
        problemas.add(new ProblemaDivision("Divide 27 cajas en 3 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"9", "8", "7", "6"}, "9"));
        problemas.add(new ProblemaDivision("Divide 36 cajas en 6 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"6", "5", "4", "7"}, "6"));
        problemas.add(new ProblemaDivision("Divide 45 cajas en 9 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"5", "4", "6", "7"}, "5"));
        problemas.add(new ProblemaDivision("Divide 50 cajas en 5 vagones. ¿Cuántas cajas en cada vagón?", new String[]{"10", "9", "8", "7"}, "10"));
        return problemas;
    }

    private void mostrarProblema() {
        ProblemaDivision problema = listaProblemas.get(problemaActual);
        textPregunta.setText(problema.getPregunta());
        textVagonActual.setText("Vagón " + vagonActual + " de " + totalVagones);

        // Cambiar la imagen del tren
        trenIcon.setImageResource(trenImages[problemaActual]);

        // Limpiar opciones anteriores
        opcionesContainer.removeAllViews();

        // Añadir opciones de respuesta aleatorias
        ArrayList<String> opciones = new ArrayList<>();
        Collections.addAll(opciones, problema.getOpciones());
        Collections.shuffle(opciones);

        for (int i = 0; i < opciones.size(); i++) {
            String opcion = opciones.get(i);
            Button opcionButton = new Button(this);
            opcionButton.setText(opcion);
            opcionButton.setTextSize(16);
            opcionButton.setOnClickListener(v -> verificarRespuesta(opcion));

            // Parámetros para el GridLayout
            GridLayout.LayoutParams params = new GridLayout.LayoutParams();
            params.columnSpec = GridLayout.spec(i % 2);  // Alterna entre columnas (0 y 1)
            params.rowSpec = GridLayout.spec(i / 2);     // Calcula la fila
            params.width = 0; // Ajustar automáticamente el ancho
            params.height = GridLayout.LayoutParams.WRAP_CONTENT; // Altura fija para hacerlo cuadrado
            params.setMargins(8, 8, 8, 8); // Margen entre botones
            params.width = 140; // Ancho fijo
            params.height = 140; // Altura fija para hacerlo cuadrado

            // Asignar los parámetros al botón
            opcionButton.setLayoutParams(params);

            // Agregar el botón al contenedor
            opcionesContainer.addView(opcionButton);
        }
    }

    private void verificarRespuesta(String respuestaSeleccionada) {
        ProblemaDivision problema = listaProblemas.get(problemaActual);
        if (respuestaSeleccionada.equals(problema.getRespuestaCorrecta())) {
            mediaPlayer = MediaPlayer.create(this, R.raw.correctsound);
            mediaPlayer.start();
            Toast.makeText(this, "¡Correcto! Vagón cargado.", Toast.LENGTH_SHORT).show();
            problemaActual++;
            vagonActual++;

            if (problemaActual < listaProblemas.size()) {
                mostrarProblema();
            } else {
                mostrarDialogoNivelCompleto();
            }
        } else {
            mediaPlayer = MediaPlayer.create(this, R.raw.errorsound);
            mediaPlayer.start();
            Toast.makeText(this, "Respuesta incorrecta. Inténtalo de nuevo.", Toast.LENGTH_SHORT).show();
        }
    }

    private void mostrarDialogoNivelCompleto() {
        mediaPlayer = MediaPlayer.create(this, R.raw.winsound);
        mediaPlayer.start();
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Nivel Completo")
                .setMessage("¡Has completado la carga de todos los vagones!")
                .setPositiveButton("Continuar", (dialog, which) -> {
                    Intent intent = new Intent(Level8Activity.this, FinalScreenActivity.class);
                    startActivity(intent);
                    finish();
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }
}
