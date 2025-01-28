package com.example.mathadventures;

import android.content.ContentValues;
import android.content.DialogInterface;
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
import android.media.MediaPlayer;

public class Level5Activity extends AppCompatActivity {

    private TextView textProblema;
    private LinearLayout opcionesContainer;
    private ArrayList<ProblemaLogica> listaProblemas;
    private int problemaActual = 0;
    private int nivelActual = 5;
    private int userId;
    private DatabaseHelper dbHelper;
    private ImageView btnBack, btnTips;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel5);

        // Inicializar vistas
        textProblema = findViewById(R.id.textProblema);
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
                Intent intent = new Intent(Level5Activity.this, LevelsActivity.class);
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

        // Obtener las vistas del diálogo
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);

        // Se establecer el texto dinámicamente
        dialogTitle.setText("Consejo");
        dialogMessage.setText("Lee atentamente el problema y analiza todas las opciones. " +
                              "Asegúrate de identifica la lógica detrás de cada respuesta antes de elegir.");

        // AlertDialog y layout personalizado
        AlertDialog.Builder builder = new AlertDialog.Builder(Level5Activity.this);
        builder.setView(dialogView)
               .setCancelable(false);

        // Crear y mostrar el diálogo
        AlertDialog dialog = builder.create();

        // Aplicar el fondo personalizado al diálogo
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_background);

        dialog.show();

        // Configurar acción para el botón Aceptar
        btnAccept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();  // Cerrar el diálogo al hacer clic en Aceptar
            }
        });
    }

    private ArrayList<ProblemaLogica> obtenerProblemas() {
        ArrayList<ProblemaLogica> problemas = new ArrayList<>();
    
        problemas.add(new ProblemaLogica("Pedro tiene 18 canicas. Si reparte 3 canicas a cada uno de sus amigos y le sobran 3, ¿cuántos amigos tiene?",
            new int[]{4, 5, 6, 7}, 5));
    
        problemas.add(new ProblemaLogica("Luis tiene 15 lápices. Si compra 3 cajas más con 4 lápices cada una, ¿cuántos lápices tendrá en total?",
            new int[]{27, 25, 29, 28}, 27));
    
       problemas.add(new ProblemaLogica("Si Laura ahorra 30 monedas y después gasta la mitad, ¿cuántas monedas le quedan?",
            new int[]{30, 20, 25, 15}, 15));
    
        problemas.add(new ProblemaLogica("Ana tenía 12 galletas. Comió 4 y luego su hermano le dio 3 más. ¿Cuántas galletas tiene ahora?",
            new int[]{10, 3, 11, 9}, 11));
    
        problemas.add(new ProblemaLogica("En una fiesta hay 24 globos y cada mesa tiene 4 globos. ¿Cuántas mesas hay en total?",
            new int[]{6, 11, 7, 8}, 6));
    
        problemas.add(new ProblemaLogica("Carlos tiene 6 cajas con 5 pelotas cada una. Si pierde 4 pelotas, ¿cuántas pelotas le quedan en total?",
            new int[]{24, 31, 30, 26}, 26));
    
        problemas.add(new ProblemaLogica("Si Sofía tiene 10 libros y su hermana le da 5 más, pero luego dona 3, ¿cuántos libros tiene ahora?",
            new int[]{10, 18, 12, 13}, 12));
    
        problemas.add(new ProblemaLogica("Martín recoge 8 flores cada día durante 5 días. Luego regala 12 flores a su madre. ¿Cuántas flores le quedan?",
            new int[]{28, 31, 32, 25}, 28));
    
        problemas.add(new ProblemaLogica("En un parque hay 16 bancas. Si cada banca tiene 2 personas sentadas, ¿cuántas personas hay en total?",
            new int[]{41, 32, 28, 34}, 32));
    
        problemas.add(new ProblemaLogica("Julia quiere comprar un juguete que cuesta 50 monedas. Si ahorra 5 monedas cada día, ¿en cuántos días tendrá suficiente dinero?",
            new int[]{10, 9, 14, 11}, 10));
    
        return problemas;
    }

    private void mostrarProblema() {
        ProblemaLogica problema = listaProblemas.get(problemaActual);
        textProblema.setText(problema.getEnunciado());

        // Limpiar opciones anteriores
        opcionesContainer.removeAllViews();

        // Crear opciones de respuesta
        for (int opcion : problema.getOpciones()) {
            Button opcionButton = new Button(this);
            opcionButton.setText(String.valueOf(opcion));
            opcionButton.setOnClickListener(v -> verificarRespuesta(opcion));
            opcionesContainer.addView(opcionButton);
        }
    }

    private void verificarRespuesta(int respuestaSeleccionada) {
        ProblemaLogica problema = listaProblemas.get(problemaActual);

        if (respuestaSeleccionada == problema.getRespuestaCorrecta()) {
            Toast.makeText(this, "¡Correcto!", Toast.LENGTH_SHORT).show();
            mediaPlayer = MediaPlayer.create(this, R.raw.correctsound);
            mediaPlayer.start();
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
                        DatabaseHelper dbHelper = new DatabaseHelper(Level5Activity.this);
                        SQLiteDatabase db = dbHelper.getWritableDatabase();

                        // Consultar el nivel actual del usuario
                        int nivelActualUsuario = dbHelper.getUserLevel(username); // Obtener el nivel actual del usuario

                        // Actualizar solo si el nuevo nivel es mayor que el nivel actual
                        int nuevoNivel = 6; // Nivel que se debe desbloquear
                        if (nuevoNivel > nivelActualUsuario) {
                            ContentValues contentValues = new ContentValues();
                            contentValues.put(DatabaseHelper.COLUMN_LEVEL, nuevoNivel);

                            // Actualizar el nivel del usuario en la base de datos
                            int rowsAffected = db.update(DatabaseHelper.TABLE_USERS, contentValues,
                                    DatabaseHelper.COLUMN_USERNAME + " = ?", new String[]{username});

                            if (rowsAffected > 0) {
                                // Si se actualizó correctamente el nivel
                                Toast.makeText(Level5Activity.this, "Nivel actualizado correctamente", Toast.LENGTH_SHORT).show();
                            } else {
                                // Si no se actualizó el nivel
                                Toast.makeText(Level5Activity.this, "Error al actualizar el nivel", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Level5Activity.this, "El progreso más avanzado ya está registrado", Toast.LENGTH_SHORT).show();
                        }

                        db.close();

                        // Redirigir a LevelsActivity
                        Intent intent = new Intent(Level5Activity.this, LevelsActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Level5Activity.this, "No se pudo obtener el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }



}
