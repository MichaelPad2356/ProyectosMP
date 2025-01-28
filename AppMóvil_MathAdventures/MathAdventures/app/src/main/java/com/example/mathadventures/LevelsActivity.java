package com.example.mathadventures;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class LevelsActivity extends AppCompatActivity {

    private ImageView lvl1, lvl2, lvl3, lvl4, lvl5, lvl6, lvl7, lvl8;
    private ProgressBar progressBar;
    private TextView percentageText;
    private static final int TOTAL_NIVELES = 8; // Número total de niveles
    private DatabaseHelper dbHelper;
    private String username; // Nombre del usuario actual

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.levels1);

        // Inicializamos la base de datos
        dbHelper = new DatabaseHelper(this);

        // Obtener el nombre del usuario desde SharedPreferences
        SharedPreferences prefs = getSharedPreferences("ProgresoUsuario", MODE_PRIVATE);
        username = prefs.getString("username", ""); // Recupéralo del SharedPreferences

        if (username.isEmpty()) {
            Toast.makeText(this, "No se pudo obtener el nombre de usuario",
            Toast.LENGTH_SHORT).show();
            return; // No continuar si no se tiene el nombre de usuario
        }

        // Inicialización de las vistas
        lvl1 = findViewById(R.id.lvl1);
        lvl2 = findViewById(R.id.lvl2);
        lvl3 = findViewById(R.id.lvl3);
        lvl4 = findViewById(R.id.lvl4);
        lvl5 = findViewById(R.id.lvl5);
        lvl6 = findViewById(R.id.lvl6);
        lvl7 = findViewById(R.id.lvl7);
        lvl8 = findViewById(R.id.lvl8);

        progressBar = findViewById(R.id.progressBar);
        percentageText = findViewById(R.id.percentageText);

        // Obtener el nivel desde la base de datos
        int currentLevel = dbHelper.getUserLevel(username);

        // Configurar los niveles desbloqueados
        configurarNiveles(currentLevel);

        // Actualizar la barra de progreso
        actualizarProgreso(currentLevel);

        // Configuración de clics para abrir los niveles
        configurarClickListeners(currentLevel);
    }

    private void configurarNiveles(int currentLevel) {
        // Actualizar las imágenes según el nivel actual del usuario
        lvl2.setImageResource(currentLevel >= 2 ?
         R.drawable.lvl2desbloqueado : R.drawable.lvl2bloqueado);
        lvl3.setImageResource(currentLevel >= 3 ?
        R.drawable.lvl3desbloqueado : R.drawable.lvl3bloqueado);
        lvl4.setImageResource(currentLevel >= 4 ?
        R.drawable.lvl4desbloqueado : R.drawable.lvl4bloqueado);
        lvl5.setImageResource(currentLevel >= 5 ?
        R.drawable.lvl5desbloqueado : R.drawable.lvl5bloqueado);
        lvl6.setImageResource(currentLevel >= 6 ?
        R.drawable.lvl6desbloqueado : R.drawable.lvl6bloqueado);
        lvl7.setImageResource(currentLevel >= 7 ?
        R.drawable.lvl7desbloqueado : R.drawable.lvl7bloqueado);
        lvl8.setImageResource(currentLevel >= 8 ?
        R.drawable.lvl8desbloqueado : R.drawable.lvl8bloqueado);
    }

    private void configurarClickListeners(int currentLevel) {
        lvl1.setOnClickListener(v -> abrirNivel(Level1Activity.class));

        lvl2.setOnClickListener(v -> {
            if (currentLevel >= 2) {
                abrirNivel(Level2Activity.class);
            } else {
                mostrarToast("Completa el nivel 1 para acceder a este nivel");
            }
        });

        lvl3.setOnClickListener(v -> {
            if (currentLevel >= 3) {
                abrirNivel(Level3Activity.class);
            } else {
                mostrarToast("Completa el nivel 2 para acceder a este nivel");
            }
        });

        lvl4.setOnClickListener(v -> {
            if (currentLevel >= 4) {
                abrirNivel(Level4Activity.class);
            } else {
                mostrarToast("Completa el nivel 3 para acceder a este nivel");
            }
        });

        lvl5.setOnClickListener(v -> {
            if (currentLevel >= 5) {
                abrirNivel(Level5Activity.class);
            } else {
                mostrarToast("Completa el nivel 4 para acceder a este nivel");
            }
        });

        lvl6.setOnClickListener(v -> {
            if (currentLevel >= 6) {
                abrirNivel(Level6Activity.class);
            } else {
                mostrarToast("Completa el nivel 5 para acceder a este nivel");
            }
        });

        lvl7.setOnClickListener(v -> {
            if (currentLevel >= 7) {
                abrirNivel(Level7Activity.class);
            } else {
                mostrarToast("Completa el nivel 6 para acceder a este nivel");
            }
        });

        lvl8.setOnClickListener(v -> {
            if (currentLevel >= 8) {
                abrirNivel(Level8Activity.class);
            } else {
                mostrarToast("Completa el nivel 7 para acceder a este nivel");
            }
        });
    }

    private void actualizarProgreso(int currentLevel) {
        int progreso = (int) (((float) currentLevel / TOTAL_NIVELES) * 100);
        progressBar.setProgress(progreso);
        percentageText.setText(progreso + "%");
    }

    private void mostrarToast(String mensaje) {
        Toast.makeText(this, mensaje, Toast.LENGTH_SHORT).show();
    }

    private void abrirNivel(Class<?> actividad) {
        Intent intent = new Intent(LevelsActivity.this, actividad);
        startActivity(intent);
    }

}
