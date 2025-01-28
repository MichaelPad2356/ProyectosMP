package com.example.mathadventures;

import android.content.ContentValues;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.sqlite.SQLiteDatabase;
import android.media.MediaPlayer;
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
import java.util.Random;
import android.media.MediaPlayer;

public class Level7Activity extends AppCompatActivity {

    private TextView textPregunta, textOperacion;
    private LinearLayout opcionesContainer;
    private ArrayList<ProblemaMultiplicacion> listaProblemas;
    private int problemaActual = 0;
    private int factorSeleccionado = -1;  // Almacena el primer factor seleccionado
    private int nivelActual = 7;
    private int userId;
    private ImageView btnBack, btnTips;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel7);

        // Inicializar vistas
        textPregunta = findViewById(R.id.textPregunta);
        textOperacion = findViewById(R.id.textOperacion);
        opcionesContainer = findViewById(R.id.opcionesContainer);
        btnBack = findViewById(R.id.btnBack);
        btnTips = findViewById(R.id.btnTips);

        // Obtener el ID del usuario desde el Intent
        userId = getIntent().getIntExtra("userId", -1);

        // Inicializar lista de problemas y mostrar el primero
        listaProblemas = generarProblemas();
        mostrarProblema();

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Level7Activity.this, LevelsActivity.class);
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
        //  LayoutInflater para inflar el archivo XML del diálogo
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_custom, null);

        // Obtener las vistas del diálogo para personalizar el contenido
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);

        // Establecer el texto para el título y el mensaje
        dialogTitle.setText("Consejo - Nivel 7");
        dialogMessage.setText("Recuerda que en las multiplicaciones avanzadas," +
                               " puedes simplificar el problema identificando los " +
                               "factores clave que multiplicados dan el resultado correcto.");

        // AlertDialog
        AlertDialog.Builder builder = new AlertDialog.Builder(Level7Activity.this);
        builder.setView(dialogView)
               .setCancelable(false); // Evitar que se cierre al tocar fuera del diálogo

        // Crear y mostrar el diálogo
        AlertDialog dialog = builder.create();

        // Fondo personalizado al diálogo
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_background);
        dialog.show();

        // Configurar acción para el botón
        btnAccept.setOnClickListener(v -> dialog.dismiss()); // Cerrar el diálogo al hacer clic
    }


    private ArrayList<ProblemaMultiplicacion> generarProblemas() {
        ArrayList<ProblemaMultiplicacion> problemas = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < 5; i++) {
            int num1 = random.nextInt(25) + 10;  // Números de dos cifras
            int num2 = random.nextInt(25) + 10;
            int producto = num1 * num2;

            ArrayList<Integer> opciones = new ArrayList<>();
            opciones.add(num1);
            opciones.add(num2);

            // Agregar números incorrectos como opciones
            while (opciones.size() < 4) {
                int opcion = random.nextInt(25) + 10;
                if (!opciones.contains(opcion)) {
                    opciones.add(opcion);
                }
            }
            Collections.shuffle(opciones);  // REVOLVER OPCIONES

            problemas.add(new ProblemaMultiplicacion("Forma el producto: " + producto, opciones, num1, num2));
        }
        return problemas;
    }

    private void mostrarProblema() {
        ProblemaMultiplicacion problema = listaProblemas.get(problemaActual);
        textPregunta.setText(problema.getPregunta());
        textOperacion.setText("Selecciona dos factores:");

        // Limpiar opciones anteriores
        opcionesContainer.removeAllViews();

        // Botones para cada opción
        for (int opcion : problema.getOpciones()) {
            Button opcionButton = new Button(this);
            opcionButton.setText(String.valueOf(opcion));
            opcionButton.setTextSize(18);

            // Configuración de tamaño y estilo de botón
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            params.setMargins(8, 8, 8, 8);
            opcionButton.setLayoutParams(params);

            // Configurar el evento de clic para cada opción
            opcionButton.setOnClickListener(v -> seleccionarFactor(opcion));
            opcionesContainer.addView(opcionButton);
        }
    }

    private void seleccionarFactor(int factor) {
        if (factorSeleccionado == -1) {
            factorSeleccionado = factor;  // Primer número seleccionado
            textOperacion.setText("Primer factor: " + factor);
        } else {
            // Verificar si ambos factores forman el producto correcto
            verificarRespuesta(factorSeleccionado, factor);
            factorSeleccionado = -1;  // Resetear para la siguiente pregunta
        }
    }

    private void verificarRespuesta(int factor1, int factor2) {
        ProblemaMultiplicacion problema = listaProblemas.get(problemaActual);

        if ((factor1 == problema.getFactor1() && factor2 == problema.getFactor2()) ||
                (factor1 == problema.getFactor2() && factor2 == problema.getFactor1())) {
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
            Toast.makeText(this, "Inténtalo de nuevo", Toast.LENGTH_SHORT).show();
            mediaPlayer = MediaPlayer.create(this, R.raw.errorsound);
            mediaPlayer.start();
            textOperacion.setText("Selecciona dos factores:");
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
                        DatabaseHelper dbHelper = new DatabaseHelper(Level7Activity.this);
                        SQLiteDatabase db = dbHelper.getWritableDatabase();

                        // Consultar el nivel actual del usuario
                        int nivelActualUsuario = dbHelper.getUserLevel(username); // Obtener el nivel actual del usuario

                        // Actualizar solo si el nuevo nivel es mayor que el nivel actual
                        int nuevoNivel = 8; // El nivel que se debe desbloquear
                        if (nuevoNivel > nivelActualUsuario) {
                            ContentValues contentValues = new ContentValues();
                            contentValues.put(DatabaseHelper.COLUMN_LEVEL, nuevoNivel);

                            // Actualizar el nivel del usuario en la base de datos
                            int rowsAffected = db.update(DatabaseHelper.TABLE_USERS, contentValues,
                                    DatabaseHelper.COLUMN_USERNAME + " = ?", new String[]{username});

                            if (rowsAffected > 0) {
                                // Si se actualizó correctamente el nivel
                                Toast.makeText(Level7Activity.this, "Nivel actualizado correctamente", Toast.LENGTH_SHORT).show();
                            } else {
                                // Si no se actualizó el nivel
                                Toast.makeText(Level7Activity.this, "Error al actualizar el nivel", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Level7Activity.this, "El progreso más avanzado ya está registrado", Toast.LENGTH_SHORT).show();
                        }

                        db.close();

                        // Redirigir a LevelsActivity
                        Intent intent = new Intent(Level7Activity.this, LevelsActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Level7Activity.this, "No se pudo obtener el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }
}
