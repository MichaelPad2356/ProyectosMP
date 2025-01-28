package com.example.mathadventures;

import android.media.MediaPlayer;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;

public class Level2Activity extends AppCompatActivity {

    private TextView textPregunta;
    private Button opcion1, opcion2, opcion3;
    private ArrayList<EjercicioMultiplicacion> listaEjercicios;
    private int ejercicioActual = 0;
    private int userId;
    ImageView btnBack, btnTips;
    private int nivelActual = 2;
    private DatabaseHelper dbHelper;
    private MediaPlayer mediaPlayer;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel2);

        // Inicializar vistas
        textPregunta = findViewById(R.id.textPregunta);
        opcion1 = findViewById(R.id.opcion1);
        opcion2 = findViewById(R.id.opcion2);
        opcion3 = findViewById(R.id.opcion3);
        btnBack = findViewById(R.id.btnBack);
        btnTips = findViewById(R.id.btnTips);

        // Obtener el ID del usuario desde el Intent
        userId = getIntent().getIntExtra("userId", -1);

        dbHelper = new DatabaseHelper(this);


        // Inicializar lista de ejercicios
        listaEjercicios = obtenerEjercicios();
        mostrarEjercicio();

        // Listeners para las opciones
        opcion1.setOnClickListener(v -> verificarRespuesta(opcion1.getText().toString()));
        opcion2.setOnClickListener(v -> verificarRespuesta(opcion2.getText().toString()));
        opcion3.setOnClickListener(v -> verificarRespuesta(opcion3.getText().toString()));

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Level2Activity.this, LevelsActivity.class);
                startActivity(intent);
                finish();
            }
        });

        // Configuracion el clic en el botón de consejos
        btnTips.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showLevel2AdviceDialog();
            }
        });
    }

    private void showLevel2AdviceDialog() {
        // Se crea un LayoutInflater para inflar el archivo XML del diálogo
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_custom, null);

        // Obtener las vistas del diálogo
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);

        dialogMessage.setText("Para resolver este nivel, recuerda que puedes arrastrar y soltar las opciones de " +
                              "multiplicación para responder correctamente. " +
                              "Piensa en los múltiplos y calcula con cuidado.");

        // Título del diálogo
        dialogTitle.setText("Consejo Nivel 2");

        // Se crea el AlertDialog y se aplica el layout personalizado
        AlertDialog.Builder builder = new AlertDialog.Builder(Level2Activity.this);
        builder.setView(dialogView)
               .setCancelable(false);  // Evitar que se cierre tocando fuera del diálogo

        // Mostrar el diálogo
        AlertDialog dialog = builder.create();

        // Fondo personalizado con bordes curvos y azul
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_background);

        dialog.show();

        // Acción para el botón Aceptar
        btnAccept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();  // Cerrar el diálogo al hacer clic en Aceptar
            }
        });
    }


    private ArrayList<EjercicioMultiplicacion> obtenerEjercicios() {
        ArrayList<EjercicioMultiplicacion> ejercicios = new ArrayList<>();
        // Ejercicios básicos, intermedios y avanzados
        ejercicios.add(new EjercicioMultiplicacion("2 x 3", new String[]{"5", "6", "7"}, 1));
        ejercicios.add(new EjercicioMultiplicacion("4 x 3", new String[]{"12", "24", "13"}, 0));
        ejercicios.add(new EjercicioMultiplicacion("5 x 4", new String[]{"35", "21", "20"}, 2));
        ejercicios.add(new EjercicioMultiplicacion("3 x 5", new String[]{"15", "16", "17"}, 0));
        ejercicios.add(new EjercicioMultiplicacion("6 x 7", new String[]{"41", "42", "43"}, 1));
        ejercicios.add(new EjercicioMultiplicacion("8 x 9", new String[]{"77", "73", "72"}, 2));
        ejercicios.add(new EjercicioMultiplicacion("7 x 6", new String[]{"42", "44", "45"}, 0));
        ejercicios.add(new EjercicioMultiplicacion("9 x 3", new String[]{"26", "27", "28"}, 1));
        ejercicios.add(new EjercicioMultiplicacion("5 x 6", new String[]{"28", "29", "30"}, 2));
        ejercicios.add(new EjercicioMultiplicacion("3 x 4", new String[]{"11", "12", "13"}, 1));
        ejercicios.add(new EjercicioMultiplicacion("10 x 7", new String[]{"70", "85", "40"}, 0));

        return ejercicios;
    }


    private void mostrarEjercicio() {
        EjercicioMultiplicacion ejercicio = listaEjercicios.get(ejercicioActual);
        textPregunta.setText(ejercicio.getPregunta());
        opcion1.setText(ejercicio.getOpciones()[0]);
        opcion2.setText(ejercicio.getOpciones()[1]);
        opcion3.setText(ejercicio.getOpciones()[2]);
    }

    private void verificarRespuesta(String respuestaSeleccionada) {
        EjercicioMultiplicacion ejercicio = listaEjercicios.get(ejercicioActual);
        String respuestaCorrecta = ejercicio.getOpciones()[ejercicio.getIndiceRespuestaCorrecta()];

        if (respuestaSeleccionada.equals(respuestaCorrecta)) {
            mediaPlayer = MediaPlayer.create(this, R.raw.correctsound);
            mediaPlayer.start();
            Toast.makeText(this, "¡Correcto!", Toast.LENGTH_SHORT).show();
            ejercicioActual++;
            if (ejercicioActual < listaEjercicios.size()) {
                mostrarEjercicio();
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
                    // Obtener el nombre de usuario desde SharedPreferences o el flujo actual
                    SharedPreferences prefs = getSharedPreferences("ProgresoUsuario", MODE_PRIVATE);
                    String username = prefs.getString("username", "");

                    if (!username.isEmpty()) {
                        // Se crea una instancia de DatabaseHelper para acceder a la base de datos
                        DatabaseHelper dbHelper = new DatabaseHelper(Level2Activity.this);
                        SQLiteDatabase db = dbHelper.getWritableDatabase();

                        // Consultar el nivel actual del usuario
                        int nivelActualUsuario = dbHelper.getUserLevel(username); // Obtener el nivel actual del usuario

                        // Actualizar solo si el nuevo nivel es mayor que el nivel actual
                        int nuevoNivel = 3; // Nivel que se debe desbloquear
                        if (nuevoNivel > nivelActualUsuario) {
                            ContentValues contentValues = new ContentValues();
                            contentValues.put(DatabaseHelper.COLUMN_LEVEL, nuevoNivel);

                            // Actualizar el nivel del usuario en la base de datos
                            int rowsAffected = db.update(DatabaseHelper.TABLE_USERS, contentValues,
                                    DatabaseHelper.COLUMN_USERNAME + " = ?", new String[]{username});

                            if (rowsAffected > 0) {
                                // Si se actualizó correctamente el nivel
                                Toast.makeText(Level2Activity.this, "Nivel actualizado correctamente", Toast.LENGTH_SHORT).show();
                            } else {
                                // Si no se actualizó el nivel
                                Toast.makeText(Level2Activity.this, "Error al actualizar el nivel", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Level2Activity.this, "El progreso más avanzado ya está registrado", Toast.LENGTH_SHORT).show();
                        }

                        db.close();

                        // Se redirige a LevelsActivity
                        Intent intent = new Intent(Level2Activity.this, LevelsActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Level2Activity.this, "No se pudo obtener el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }
}



