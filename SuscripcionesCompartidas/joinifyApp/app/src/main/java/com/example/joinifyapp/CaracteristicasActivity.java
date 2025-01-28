package com.example.joinifyapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class CaracteristicasActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.caracteristicas); // Layout acerca_de.xml

        Button botonComenzar = findViewById(R.id.botonComenzar);


        // Asigna un listener al botón
        botonComenzar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(CaracteristicasActivity.this, Registro.class);
                startActivity(intent); // Inicia la actividad Registro
            }
        });
    }
}