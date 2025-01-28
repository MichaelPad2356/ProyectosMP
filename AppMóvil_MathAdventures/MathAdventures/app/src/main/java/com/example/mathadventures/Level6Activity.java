package com.example.mathadventures;

import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.GridLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import android.view.LayoutInflater;
import android.media.MediaPlayer;

public class Level6Activity extends AppCompatActivity {

    private TextView textPregunta;
    private ImageView imagenFraccion;
    private GridLayout opcionesContainer;
    private ArrayList<ProblemaFraccion> listaProblemas;
    private int problemaActual = 0;
    private int nivelActual = 6;
    private int userId;
    private ImageView btnBack, btnTips;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel6);

        // Inicializar vistasde
        textPregunta = findViewById(R.id.textPregunta);
        imagenFraccion = findViewById(R.id.imagenFraccion);
        opcionesContainer = findViewById(R.id.opcionesContainer);
        btnBack = findViewById(R.id.btnBack);
        btnTips = findViewById(R.id.btnTips);

        // Obtener el ID del usuario desde el Intent
        userId = getIntent().getIntExtra("userId", -1);

        // Inicializar lista de problemas y mostrar el primero
        listaProblemas = obtenerProblemas();
        mostrarProblema();

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Level6Activity.this, LevelsActivity.class);
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

        // Vistas del diálogo para personalizar el contenido
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);

        // Texto para el título y el mensaje
        dialogTitle.setText("Consejo - Nivel 6");
        dialogMessage.setText("Observa atentamente la parte sombreada en la figura. " +
                              "Cuenta cuántas partes iguales tiene y cuántas están " +
                              "sombreadas para determinar la fracción.");

        // AlertDialog
        AlertDialog.Builder builder = new AlertDialog.Builder(Level6Activity.this);
        builder.setView(dialogView)
               .setCancelable(false); // Evitar que se cierre al tocar fuera del diálogo

        // Crear y mostrar el diálogo
        AlertDialog dialog = builder.create();

        // Fondo personalizado al diálogo
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_background);
        dialog.show();

        // Acción para el botón
        btnAccept.setOnClickListener(v -> dialog.dismiss()); // Cerrar el diálogo al hacer clic
    }

    private ArrayList<ProblemaFraccion> obtenerProblemas() {
        ArrayList<ProblemaFraccion> problemas = new ArrayList<>();

        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura1, new String[]{"1/3", "1/6", "8/9", "1/4"}, "8/9"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura2, new String[]{"1/8", "1/4", "1/5", "1/2"}, "1/4"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura3, new String[]{"1/2", "3/4", "1/5", "1/3"}, "3/4"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura4, new String[]{"1/4", "1/3", "1/5", "1/2"}, "1/3"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura5, new String[]{"1/3", "1/4", "1/5", "2/3"}, "2/3"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura6, new String[]{"1/8", "1/4", "1/6", "1/3"}, "1/6"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura7, new String[]{"1/4", "3/8", "1/8", "1/2"}, "1/8"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura8, new String[]{"1/2", "3/8", "1/8", "3/4"}, "3/8"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura9, new String[]{"1/3", "1/2", "1/8", "1/5"}, "1/5"));
        problemas.add(new ProblemaFraccion("¿Qué fracción representa la parte sombreada?", R.drawable.figura10, new String[]{"3/4", "1/2", "1/3", "1/4"}, "1/2"));

        return problemas;
    }


    private void mostrarProblema() {
        ProblemaFraccion problema = listaProblemas.get(problemaActual);
        textPregunta.setText(problema.getPregunta());

        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
            320, // Ancho deseado en píxeles
            320  // Alto deseado en píxeles
        );
        params.setMargins(16, 16, 16, 16); // Margen alrededor de la imagen
        imagenFraccion.setLayoutParams(params);

        // Establecer la imagen del problema
        imagenFraccion.setImageResource(problema.getImagenResourceId());

        // Limpiar las opciones anteriores
        GridLayout opcionesContainer = findViewById(R.id.opcionesContainer);
        opcionesContainer.removeAllViews();

        // Añadir las opciones de respuesta
        for (String opcion : problema.getOpciones()) {
            Button opcionButton = new Button(this);
            opcionButton.setText(opcion);
            opcionButton.setTextSize(16);

            // Configurar los LayoutParams para los botones
            GridLayout.LayoutParams buttonParams = new GridLayout.LayoutParams();
            buttonParams.width = 200; // Ancho fijo en píxeles
            buttonParams.height = 100; // Altura fija en píxeles
            buttonParams.setMargins(8, 8, 8, 8); // Margen entre botones
            buttonParams.setGravity(Gravity.CENTER);
            opcionButton.setLayoutParams(buttonParams);

            // Configurar el evento de clic en el botón
            opcionButton.setOnClickListener(v -> verificarRespuesta(opcion));

            // Agregar el botón al contenedor
            opcionesContainer.addView(opcionButton);
        }
    }

    private void verificarRespuesta(String respuestaSeleccionada) {
        ProblemaFraccion problema = listaProblemas.get(problemaActual);
        if (respuestaSeleccionada.equals(problema.getRespuestaCorrecta())) {
            mediaPlayer = MediaPlayer.create(this, R.raw.correctsound);
            mediaPlayer.start();
            Toast.makeText(this, "¡Correcto!", Toast.LENGTH_SHORT).show();
            problemaActual++;
            if (problemaActual < listaProblemas.size()) {
                mostrarProblema();
            } else {
                mostrarDialogoNivelCompleto();
            }
        } else {
            mediaPlayer = MediaPlayer.create(this, R.raw.errorsound);
            mediaPlayer.start();
            Toast.makeText(this, "Inténtalo de nuevo", Toast.LENGTH_SHORT).show();
        }
    }

    private void mostrarDialogoNivelCompleto() {
        mediaPlayer = MediaPlayer.create(this, R.raw.winsound);
        mediaPlayer.start();
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Nivel Completo")
                .setMessage("¡Has completado todos los ejercicios del nivel!")
                .setPositiveButton("Continuar", (dialog, which) -> {
                    // Obtener el nombre de usuario desde SharedPreferences
                    SharedPreferences prefs = getSharedPreferences("ProgresoUsuario", MODE_PRIVATE);
                    String username = prefs.getString("username", "");

                    if (!username.isEmpty()) {
                        // Crear una instancia de DatabaseHelper para acceder a la base de datos
                        DatabaseHelper dbHelper = new DatabaseHelper(Level6Activity.this);
                        SQLiteDatabase db = dbHelper.getWritableDatabase();

                        // Consultar el nivel actual del usuario
                        int nivelActualUsuario = dbHelper.getUserLevel(username); // Obtener el nivel actual del usuario

                        // Actualizar solo si el nuevo nivel es mayor que el nivel actual
                        int nuevoNivel = 7; // El nivel que se debe desbloquear
                        if (nuevoNivel > nivelActualUsuario) {
                            ContentValues contentValues = new ContentValues();
                            contentValues.put(DatabaseHelper.COLUMN_LEVEL, nuevoNivel);

                            // Actualizar el nivel del usuario en la base de datos
                            int rowsAffected = db.update(DatabaseHelper.TABLE_USERS, contentValues,
                                    DatabaseHelper.COLUMN_USERNAME + " = ?", new String[]{username});

                            if (rowsAffected > 0) {
                                // Si se actualizó correctamente el nivel
                                Toast.makeText(Level6Activity.this, "Nivel actualizado correctamente", Toast.LENGTH_SHORT).show();
                            } else {
                                // Si no se actualizó el nivel
                                Toast.makeText(Level6Activity.this, "Error al actualizar el nivel", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Level6Activity.this, "El progreso más avanzado ya está registrado", Toast.LENGTH_SHORT).show();
                        }

                        db.close();

                        // Redirigir a LevelsActivity
                        Intent intent = new Intent(Level6Activity.this, LevelsActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Level6Activity.this, "No se pudo obtener el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }


}
