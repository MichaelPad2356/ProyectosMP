package com.example.mathadventures;

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
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import android.media.MediaPlayer;

public class Level4Activity extends AppCompatActivity {

    private TextView textPregunta;
    private LinearLayout secuenciaContainer;
    private LinearLayout opcionesContainer;
    private ArrayList<EjercicioSecuencia> listaEjercicios;
    private int ejercicioActual = 0;
    private int espaciosRestantes;
    private ArrayList<TextView> espaciosEnBlanco = new ArrayList<>();
    private int nivelActual = 4;
    private int userId;
    private DatabaseHelper dbHelper;
    private ImageView btnBack, btnTips;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel4);

        // Inicializar vistas
        textPregunta = findViewById(R.id.textPregunta);
        secuenciaContainer = findViewById(R.id.secuenciaContainer);
        opcionesContainer = findViewById(R.id.opcionesContainer);
        btnBack = findViewById(R.id.btnBack);
        btnTips = findViewById(R.id.btnTips);

        // Obtener el ID del usuario desde el Intent
        userId = getIntent().getIntExtra("userId", -1);

        dbHelper = new DatabaseHelper(this);

        // Inicializar lista de ejercicios y mostrar el primero
        listaEjercicios = obtenerEjercicios();
        mostrarEjercicio();

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Level4Activity.this, LevelsActivity.class);
                startActivity(intent);
                finish();
            }
        });


        btnTips.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAdviceDialog();
            }
        });
    }

    private void showAdviceDialog() {
     
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_custom, null);

        // Obtener las vistas del diálogo
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);

        dialogTitle.setText(R.string.advice_title);
        dialogMessage.setText(R.string.advice_message);

        //AlertDialog y aplicar el layout personalizado
        AlertDialog.Builder builder = new AlertDialog.Builder(Level4Activity.this);
        builder.setView(dialogView)
               .setCancelable(false);  // Evitar que se cierre tocando fuera del diálogo

        // Crear y mostrar el diálogo
        AlertDialog dialog = builder.create();

        // Fondo personalizado al diálogo
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_background);

        dialog.show();

        // Acción para el botón Aceptar
        btnAccept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
    }


    private ArrayList<EjercicioSecuencia> obtenerEjercicios() {
        ArrayList<EjercicioSecuencia> ejercicios = new ArrayList<>();

        // Ejercicio 1: Suma de 2
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{2, -1, 6, -1, 10}, new int[]{4, 8, 5, 9, 3, 12}, new int[]{4, 8}));


        // Ejercicio 2: Suma de 3
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{3, -1, 9, -1, 15}, new int[]{6, 12, 18, 8, 10, 4}, new int[]{6, 12}));

       ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{1, -1, -1, 8, -1, 32}, new int[]{2, 4, 16, 3, 12, 24}, new int[]{2, 4, 16}));

        // Ejercicio 4: Suma de 5
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{5, -1, 15, -1, 25}, new int[]{10, 20, 8, 30, 18, 35}, new int[]{10, 20}));

        // Ejercicio 5: Resta de 2
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{12, -1, 8, -1, 4}, new int[]{10, 6, 5, 14, 2, 1}, new int[]{10, 6}));

        // Ejercicio 6: Suma de 4
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{4, -1, 12, -1, 20}, new int[]{8, 16, 6, 14, 18, 24}, new int[]{8, 16}));

        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{2, -1, 6, -1, 18}, new int[]{4, 12, 5, 20, 16, 9}, new int[]{4, 12}));

        // Ejercicio 8: Suma de 10
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{10, -1, 30, -1, 50}, new int[]{20, 40, 15, 45, 55, 25}, new int[]{20, 40}));

        // Ejercicio 9: Resta de 5
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{20, -1, 10, -1, 0}, new int[]{15, 5, 18, 2, 12, 8}, new int[]{15, 5}));

        // Ejercicio 10: Suma alterna de 2 y 3
        ejercicios.add(new EjercicioSecuencia("Completa la secuencia",
                new int[]{1, -1, 4, -1, 7, -1}, new int[]{3, 6, 8, 10, 2, 5}, new int[]{3, 6, 8}));

        return ejercicios;
    }

    private void mostrarEjercicio() {
        EjercicioSecuencia ejercicio = listaEjercicios.get(ejercicioActual);
        textPregunta.setText(ejercicio.getPregunta());

        // Limpiar contenedores y opciones anteriores
        secuenciaContainer.removeAllViews();
        opcionesContainer.removeAllViews();
        espaciosEnBlanco.clear();

        // Secuencia con espacios en blanco
        for (int numero : ejercicio.getSecuencia()) {
            TextView numeroView = new TextView(this);
            numeroView.setTextSize(24);
            numeroView.setPadding(16, 8, 16, 8);

            if (numero == -1) {
                numeroView.setText("_");
                numeroView.setBackgroundResource(R.drawable.espacio_blanco);
                numeroView.setTag("espacio");
                espaciosEnBlanco.add(numeroView);
            } else {
                numeroView.setText(String.valueOf(numero));
            }
            secuenciaContainer.addView(numeroView);
        }

        LinearLayout filaActual = crearNuevaFila();

        for (int i = 0; i < ejercicio.getOpciones().length; i++) {
            final int opcionSeleccionada = ejercicio.getOpciones()[i];
            Button opcionButton = new Button(this);
            opcionButton.setText(String.valueOf(opcionSeleccionada));
            opcionButton.setTextSize(18);

            int buttonSize = 120;
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(buttonSize, buttonSize);
            params.setMargins(8, 8, 8, 8);
            opcionButton.setLayoutParams(params);

            opcionButton.setOnClickListener(v -> completarEspacio(opcionSeleccionada));
            filaActual.addView(opcionButton);


            if ((i + 1) % 3 == 0) {
                opcionesContainer.addView(filaActual);
                filaActual = crearNuevaFila();
            }
        }


        if (filaActual.getChildCount() > 0) {
            opcionesContainer.addView(filaActual);
        }

        espaciosRestantes = espaciosEnBlanco.size();
    }

    private LinearLayout crearNuevaFila() {
        LinearLayout fila = new LinearLayout(this);
        fila.setOrientation(LinearLayout.HORIZONTAL);
        fila.setGravity(View.TEXT_ALIGNMENT_CENTER);
        fila.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));
        return fila;
    }

    private void completarEspacio(int numeroSeleccionado) {
        if (espaciosRestantes > 0) {
            TextView primerEspacio = espaciosEnBlanco.get(0);
            primerEspacio.setText(String.valueOf(numeroSeleccionado));
            primerEspacio.setBackground(null);

            espaciosEnBlanco.remove(0);
            espaciosRestantes--;

            verificarSecuencia();
        }
    }

    private void verificarSecuencia() {
        if (espaciosRestantes == 0) {
            EjercicioSecuencia ejercicio = listaEjercicios.get(ejercicioActual);
            boolean esCorrecto = true;

            int[] respuestasCorrectas = ejercicio.getRespuestasCorrectas();
            int respuestaIndice = 0;

            // Recorremos la secuencia y solo verificamos los espacios en blanco
            for (int i = 0; i < ejercicio.getSecuencia().length; i++) {
                int numeroEnSecuencia = ejercicio.getSecuencia()[i];
                if (numeroEnSecuencia == -1) {
                    TextView numeroView = (TextView) secuenciaContainer.getChildAt(i);
                    int numeroSeleccionado = Integer.parseInt(numeroView.getText().toString());


                    if (numeroSeleccionado != respuestasCorrectas[respuestaIndice]) {
                        esCorrecto = false;
                        break;
                    }
                    respuestaIndice++;
                }
            }

            if (esCorrecto) {
                mediaPlayer = MediaPlayer.create(this, R.raw.correctsound);
                mediaPlayer.start();
                Toast.makeText(this, "Correcto!", Toast.LENGTH_SHORT).show();
                ejercicioActual++;
                if (ejercicioActual < listaEjercicios.size()) {
                    mostrarEjercicio();
                } else {
                    mostrarDialogoNivelCompleto();
                }
            } else {
                mediaPlayer = MediaPlayer.create(this, R.raw.errorsound);
                mediaPlayer.start();
                Toast.makeText(this, "Intentalo de nuevo", Toast.LENGTH_SHORT).show();
                mostrarEjercicio();
            }
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
                        // Crear una instancia de DatabaseHelper para acceder a la base de datos
                        DatabaseHelper dbHelper = new DatabaseHelper(Level4Activity.this);
                        SQLiteDatabase db = dbHelper.getWritableDatabase();

                        // Consultar el nivel actual del usuario
                        int nivelActualUsuario = dbHelper.getUserLevel(username); // Obtener el nivel actual del usuario

                        // Actualizar solo si el nuevo nivel es mayor que el nivel actual
                        int nuevoNivel = 5; // Nivel que se debe desbloquear
                        if (nuevoNivel > nivelActualUsuario) {
                            ContentValues contentValues = new ContentValues();
                            contentValues.put(DatabaseHelper.COLUMN_LEVEL, nuevoNivel);

                            // Actualizar el nivel del usuario en la base de datos
                            int rowsAffected = db.update(DatabaseHelper.TABLE_USERS, contentValues,
                                    DatabaseHelper.COLUMN_USERNAME + " = ?", new String[]{username});

                            if (rowsAffected > 0) {
                                // Si se actualizó correctamente el nivel
                                Toast.makeText(Level4Activity.this, "Nivel actualizado correctamente", Toast.LENGTH_SHORT).show();
                            } else {
                                // Si no se actualizó el nivel
                                Toast.makeText(Level4Activity.this, "Error al actualizar el nivel", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Level4Activity.this, "El progreso más avanzado ya está registrado", Toast.LENGTH_SHORT).show();
                        }

                        db.close();

                        // Se redirige a LevelsActivity
                        Intent intent = new Intent(Level4Activity.this, LevelsActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Level4Activity.this, "No se pudo obtener el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }


}

