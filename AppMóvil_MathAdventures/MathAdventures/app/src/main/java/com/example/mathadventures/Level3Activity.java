package com.example.mathadventures;

import android.media.MediaPlayer;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.DragEvent;
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

public class Level3Activity extends AppCompatActivity {

    private TextView textPregunta;
    private LinearLayout cubetasContainer;
    private ArrayList<EjercicioDivision> listaEjercicios;
    private int ejercicioActual = 0;
    private int objetosRestantes;
    private ArrayList<ImageView> objetos = new ArrayList<>();
    private ImageView btnBack, btnTips;
    private ArrayList<LinearLayout> cubetas = new ArrayList<>();  // Lista de cubetas
    private ArrayList<TextView> contadores = new ArrayList<>();   // Lista de contadores de cada cubeta
    private int nivelActual = 3;
    private int userId;
    private DatabaseHelper dbHelper;
    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nivel3);

        // Inicializar vistas
        textPregunta = findViewById(R.id.textPregunta);
        cubetasContainer = findViewById(R.id.cubetasContainer);
        btnBack = findViewById(R.id.btnBack);
        btnTips = findViewById(R.id.btnTips);

        // Obtener el ID del usuario desde el Intent
        userId = getIntent().getIntExtra("userId", -1);

        dbHelper = new DatabaseHelper(this);


        // Configurar listener para regresar
        btnBack.setOnClickListener(v -> {
            Intent intent = new Intent(Level3Activity.this, LevelsActivity.class);
            startActivity(intent);
            finish();
        });

        // Inicializar lista de ejercicios y mostrar el primero
        listaEjercicios = obtenerEjercicios();
        mostrarEjercicio();

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Level3Activity.this, LevelsActivity.class);
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
        // Se crea un LayoutInflater para inflar el archivo XML del diálogo
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_custom, null);

        // Obtener las vistas del diálogo si es necesario para modificar texto o propiedades
        TextView dialogTitle = dialogView.findViewById(R.id.dialog_title);
        TextView dialogMessage = dialogView.findViewById(R.id.dialog_message);
        Button btnAccept = dialogView.findViewById(R.id.btn_accept);


        dialogMessage.setText("Para completar este nivel, recuerda que puedes arrastrar los objetos" +
                              " a las cubetas para formar grupos iguales. " +
                              "Observa bien la cantidad y asegúrate de distribuirlos correctamente.");

        // AlertDialog y layout personalizado
        AlertDialog.Builder builder = new AlertDialog.Builder(Level3Activity.this);
        builder.setView(dialogView)
               .setCancelable(false);  // Evitar que se cierre tocando fuera del diálogo

        // Aplicar el fondo
        builder.setCancelable(false);

        // Mostrar el diálogo
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


    private ArrayList<EjercicioDivision> obtenerEjercicios() {
        ArrayList<EjercicioDivision> ejercicios = new ArrayList<>();
        ejercicios.add(new EjercicioDivision("10 ÷ 2", 10, 2)); // 5 en cada cubeta
        ejercicios.add(new EjercicioDivision("12 ÷ 3", 12, 3)); // 4 en cada cubeta
        ejercicios.add(new EjercicioDivision("20 ÷ 4", 20, 4)); // 5 en cada cubeta
        ejercicios.add(new EjercicioDivision("30 ÷ 5", 30, 5)); // 6 en cada cubeta
        ejercicios.add(new EjercicioDivision("18 ÷ 3", 18, 3)); // 6 en cada cubeta
        return ejercicios;
    }


     private void mostrarEjercicio() {
        EjercicioDivision ejercicio = listaEjercicios.get(ejercicioActual);
        textPregunta.setText(ejercicio.getPregunta());

        // Limpiar objetos y contenedores anteriores
        limpiarCubetas();
        limpiarObjetos();

        // Configurar cubetas y contadores
        for (int i = 0; i < ejercicio.getNumeroGrupos(); i++) {
            LinearLayout cubeta = new LinearLayout(this);
            cubeta.setOrientation(LinearLayout.VERTICAL);

            // Establecer dimensiones manualmente
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                225, // Ancho en píxeles
                200  // Alto en píxeles
            );
            params.setMargins(16, 16, 16, 16); // Márgenes entre las cubetas
            cubeta.setLayoutParams(params);

            // Establecer fondo y listener
            cubeta.setBackground(getDrawable(R.drawable.cubeta));
            cubeta.setOnDragListener(new CubetaDragListener(i));

            // Crear y configurar el contador
            TextView contador = new TextView(this);
            contador.setText("0");  // Contador inicial
            contador.setTextSize(16);
            contador.setGravity(View.TEXT_ALIGNMENT_CENTER);

            // Añadir contador y cubeta al layout
            cubeta.addView(contador);
            cubetasContainer.addView(cubeta);

            // Agregar cubeta y contador a las listas
            cubetas.add(cubeta);
            contadores.add(contador);
        }


        // Agregar objetos (pelotas) para el ejercicio actual
        objetosRestantes = ejercicio.getNumeroObjetos();
        LinearLayout objetosContainer = findViewById(R.id.objetosContainer);
        objetos.clear();

        for (int i = 0; i < objetosRestantes; i++) {
            ImageView objeto = new ImageView(this);
            objeto.setImageResource(R.drawable.pelota);

            
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                120, // Ancho en píxeles
                120  // Alto en píxeles
            );
            params.setMargins(8, 8, 8, 8); // Margen entre las imágenes
            objeto.setLayoutParams(params);

            // Configurar evento de arrastrar
            objeto.setOnLongClickListener(longClickListener);

            // Agregar al contenedor y a la lista
            objetosContainer.addView(objeto);
            objetos.add(objeto);
        }
    }
    private View.OnLongClickListener longClickListener = new View.OnLongClickListener() {
        @Override
        public boolean onLongClick(View v) {
            View.DragShadowBuilder dragShadow = new View.DragShadowBuilder(v);
            v.startDragAndDrop(null, dragShadow, v, 0);
            return true;
        }
    };

    private class CubetaDragListener implements View.OnDragListener {
        private int cubetaIndex;

        CubetaDragListener(int index) {
            this.cubetaIndex = index;
        }

        @Override
        public boolean onDrag(View v, DragEvent event) {
            switch (event.getAction()) {
                case DragEvent.ACTION_DROP:
                    View view = (View) event.getLocalState();
                    if (view != null && view.getParent() instanceof LinearLayout) {
                        ((LinearLayout) view.getParent()).removeView(view);
                        ((LinearLayout) v).addView(view);
                        view.setOnLongClickListener(null);

                        // Se actualiza el contador
                        int cuenta = Integer.parseInt(contadores.get(cubetaIndex).getText().toString()) + 1;
                        contadores.get(cubetaIndex).setText(String.valueOf(cuenta));

                        objetosRestantes--;
                        verificarGrupos();
                    }
                    return true;
            }
            return true;
        }
    }

    private void verificarGrupos() {
        EjercicioDivision ejercicio = listaEjercicios.get(ejercicioActual);
        int objetosPorCubeta = ejercicio.getObjetosPorGrupo();
        boolean esCorrecto = true;

        for (int i = 0; i < ejercicio.getNumeroGrupos(); i++) {
            int cuenta = Integer.parseInt(contadores.get(i).getText().toString());
            if (cuenta != objetosPorCubeta) {
                esCorrecto = false;
                break;
            }
        }

        if (objetosRestantes == 0 && esCorrecto) {
            Toast.makeText(this, "¡Correcto!", Toast.LENGTH_SHORT).show();
            mediaPlayer = MediaPlayer.create(this, R.raw.correctsound);
            mediaPlayer.start();
            ejercicioActual++;
            if (ejercicioActual < listaEjercicios.size()) {
                mostrarEjercicio();
            } else {
                mostrarDialogoNivelCompleto();
            }
        } else if (objetosRestantes == 0) {
            Toast.makeText(this, "Inténtalo de nuevo", Toast.LENGTH_SHORT).show();
            mediaPlayer = MediaPlayer.create(this, R.raw.errorsound);
            mediaPlayer.start();
            mostrarEjercicio(); // Reiniciar ejercicio
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
                        DatabaseHelper dbHelper = new DatabaseHelper(Level3Activity.this);
                        SQLiteDatabase db = dbHelper.getWritableDatabase();

                        // Consultar el nivel actual del usuario
                        int nivelActualUsuario = dbHelper.getUserLevel(username); // Obtener el nivel actual del usuario

                        // Actualizar solo si el nuevo nivel es mayor que el nivel actual
                        int nuevoNivel = 4; // Nivel que se debe desbloquear
                        if (nuevoNivel > nivelActualUsuario) {
                            ContentValues contentValues = new ContentValues();
                            contentValues.put(DatabaseHelper.COLUMN_LEVEL, nuevoNivel);

                            // Actualizar el nivel del usuario en la base de datos
                            int rowsAffected = db.update(DatabaseHelper.TABLE_USERS, contentValues,
                                    DatabaseHelper.COLUMN_USERNAME + " = ?", new String[]{username});

                            if (rowsAffected > 0) {
                                // Si se actualizó correctamente el nivel
                                Toast.makeText(Level3Activity.this, "Nivel actualizado correctamente", Toast.LENGTH_SHORT).show();
                            } else {
                                // Si no se actualizó el nivel (tal vez el usuario no existe)
                                Toast.makeText(Level3Activity.this, "Error al actualizar el nivel", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Level3Activity.this, "El progreso más avanzado ya está registrado", Toast.LENGTH_SHORT).show();
                        }

                        db.close();

                        // Redirigir a LevelsActivity
                        Intent intent = new Intent(Level3Activity.this, LevelsActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Level3Activity.this, "No se pudo obtener el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancelar", (dialog, which) -> dialog.dismiss());
        builder.create().show();
    }



    private void limpiarCubetas() {
        cubetasContainer.removeAllViews();
        cubetas.clear();
        contadores.clear();
    }

    private void limpiarObjetos() {
        LinearLayout objetosContainer = findViewById(R.id.objetosContainer);
        objetosContainer.removeAllViews();
    }
}
