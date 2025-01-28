package com.example.mathadventures;

import android.media.MediaPlayer;
import android.content.ClipData;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.DragEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;

public class Level1Activity extends AppCompatActivity {
    private TextView textPregunta, dropArea, opcion1, opcion2, opcion3;
    private ArrayList<Ejercicio1> listaEjercicios;
    private int ejercicioActual = 0;
    private ImageView btnBack, btnTips;
    private DatabaseHelper dbHelper;
    private int userId;
    private int nivelActual = 1;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel1);

        // Inicializar vistas
        textPregunta = findViewById(R.id.textPregunta);
        dropArea = findViewById(R.id.dropArea);
        opcion1 = findViewById(R.id.opcion1);
        opcion2 = findViewById(R.id.opcion2);
        opcion3 = findViewById(R.id.opcion3);
        btnBack = findViewById(R.id.btnBack);
        btnTips = findViewById(R.id.btnTips);
        dbHelper = new DatabaseHelper(this);

        // Obtener el ID del usuario desde el Intent
        userId = getIntent().getIntExtra("userId", -1);

        // Inicializar lista de ejercicios
        listaEjercicios = obtenerEjercicios();
        mostrarEjercicio();

        // Configurar drag and drop
        configurarDragAndDrop(opcion1);
        configurarDragAndDrop(opcion2);
        configurarDragAndDrop(opcion3);

        // Configuracion del área de drop (zona para soltar)
        dropArea.setOnDragListener(new View.OnDragListener() {
            @Override
            public boolean onDrag(View v, DragEvent event) {
                switch (event.getAction()) {
                    case DragEvent.ACTION_DRAG_STARTED:
                        return true;

                    case DragEvent.ACTION_DRAG_ENTERED:
                        v.setBackgroundColor(getResources().getColor
                        (R.color.design_default_color_secondary));
                        return true;

                    case DragEvent.ACTION_DRAG_EXITED:
                        v.setBackgroundColor(getResources().getColor(R.color.transparent));
                        return true;

                    case DragEvent.ACTION_DROP:
                        TextView opcionArrastrada = (TextView) event.getLocalState();
                        String respuestaSeleccionada = opcionArrastrada.getText().toString();
                        dropArea.setText(respuestaSeleccionada);
                        verificarRespuesta(Integer.parseInt(respuestaSeleccionada));
                        return true;

                    case DragEvent.ACTION_DRAG_ENDED:
                        v.setBackgroundResource(R.drawable.interactive_background);
                        return true;

                    default:
                        return false;
                }
            }
        });

        btnBack.setOnClickListener(v -> {
            Intent intent = new Intent(Level1Activity.this, LevelsActivity.class);
            intent.putExtra("userId", userId);
            startActivity(intent);
            finish();
        });

        // Configuracion  del clic en el botón de consejos
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

        // Se obtienen las vistas del diálogo
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);


        dialogMessage.setText("Para resolver este nivel, recuerda que puedes arrastrar y soltar" +
        "los números para completar las operaciones correctamente. Piensa en cómo usar los múltiplos de"
        + "10 y 100.");

        // Se crea el AlertDialog y aplicar el layout personalizado
        AlertDialog.Builder builder = new AlertDialog.Builder(Level1Activity.this);
        builder.setView(dialogView)
               .setCancelable(false);  // Evitar que se cierre tocando fuera del diálogo

        // Se aplica el fondo con bordes curvos y azul
        builder.setCancelable(false);

        // Se muestra el diálogo
        AlertDialog dialog = builder.create();

        // Se aplica el fondo personalizado al diálogo
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.dialog_background);

        dialog.show();

        // Acción para el botón Aceptar
        btnAccept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();  // Se cierra el diálogo al hacer clic en Aceptar
            }
        });
    }


    private void configurarDragAndDrop(final TextView opcion) {
        opcion.setOnLongClickListener(v -> {
            ClipData datos = ClipData.newPlainText("valor", opcion.getText().toString());
            View.DragShadowBuilder sombra = new View.DragShadowBuilder(v);
            v.startDragAndDrop(datos, sombra, v, 0);
            return true;
        });
    }

    private ArrayList<Ejercicio1> obtenerEjercicios() {
        ArrayList<Ejercicio1> ejercicios = new ArrayList<>();
        ejercicios.add(new Ejercicio1("30 + ___ = 40", new String[]{"10", "20", "30"}, 0));
        ejercicios.add(new Ejercicio1("60 + ___ = 80", new String[]{"10", "20", "30"}, 1));
        ejercicios.add(new Ejercicio1("100 - ___ = 70", new String[]{"20", "95", "30"}, 2));
        ejercicios.add(new Ejercicio1("200 + ___ = 400", new String[]{"100", "200", "300"}, 1));
        ejercicios.add(new Ejercicio1("300 - ___ = 200", new String[]{"100", "600", "150"}, 0));
        ejercicios.add(new Ejercicio1("90 + ___ = 150", new String[]{"40", "50", "60"}, 2));
        ejercicios.add(new Ejercicio1("500 + ___ = 800", new String[]{"200", "300", "400"}, 1));
        ejercicios.add(new Ejercicio1("900 - ___ = 500", new String[]{"200", "300", "400"}, 2));
        ejercicios.add(new Ejercicio1("110 - ___ = 30", new String[]{"80", "50", "60"}, 0));
        ejercicios.add(new Ejercicio1("600 - ___ = 400", new String[]{"100", "200", "300"}, 1));
        return ejercicios;
    }

    private void mostrarEjercicio() {
        Ejercicio1 ejercicio = listaEjercicios.get(ejercicioActual);
        textPregunta.setText(ejercicio.getPregunta());
        opcion1.setText(ejercicio.getOpciones()[0]);
        opcion2.setText(ejercicio.getOpciones()[1]);
        opcion3.setText(ejercicio.getOpciones()[2]);

        // Reiniciar el contenido y el diseño de dropArea
        dropArea.setText("___");
        dropArea.setBackgroundResource(R.drawable.interactive_background);
    }


    private void verificarRespuesta(int respuestaSeleccionada) {
        Ejercicio1 ejercicio = listaEjercicios.get(ejercicioActual);
        int respuestaCorrecta = Integer.parseInt(ejercicio.getOpciones()[ejercicio.getIndiceRespuestaCorrecta()]);

        if (respuestaSeleccionada == respuestaCorrecta) {
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
            dropArea.setText("___");
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
                    String username = prefs.getString("username", ""); // Suponiendo que guardas el nombre de usuario aquí

                    if (!username.isEmpty()) {
                        // Se crea una instancia de DatabaseHelper para acceder a la base de datos
                        DatabaseHelper dbHelper = new DatabaseHelper(Level1Activity.this);
                        SQLiteDatabase db = dbHelper.getWritableDatabase();

                        // Consultar el nivel actual del usuario
                        int nivelActualUsuario = dbHelper.getUserLevel(username); // Se obtiene el nivel actual del usuario

                        // Actualizar solo si el nuevo nivel es mayor que el nivel actual
                        int nuevoNivel = 2; // Nivel que se debe desbloquear
                        if (nuevoNivel > nivelActualUsuario) {
                            ContentValues contentValues = new ContentValues();
                            contentValues.put(DatabaseHelper.COLUMN_LEVEL, nuevoNivel);

                            // Se actualiza el nivel del usuario en la base de datos
                            int rowsAffected = db.update(DatabaseHelper.TABLE_USERS, contentValues,
                                    DatabaseHelper.COLUMN_USERNAME + " = ?", new String[]{username});

                            if (rowsAffected > 0) {
                                // Si se actualizó correctamente el nivel
                                Toast.makeText(Level1Activity.this, "Nivel actualizado correctamente", Toast.LENGTH_SHORT).show();
                            } else {
                                // Si no se actualizó el nivel
                                Toast.makeText(Level1Activity.this, "Error al actualizar el nivel", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Level1Activity.this, "El progreso más avanzado ya está registrado", Toast.LENGTH_SHORT).show();
                        }

                        db.close();

                        // Redirigir a LevelsActivity
                        Intent intent = new Intent(Level1Activity.this, LevelsActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Level1Activity.this, "No se pudo obtener el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }
}
