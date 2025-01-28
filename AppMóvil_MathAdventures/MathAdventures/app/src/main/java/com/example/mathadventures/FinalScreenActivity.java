package com.example.mathadventures;

import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class FinalScreenActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_final_screen);

        CoheteInteractivoView coheteView = findViewById(R.id.coheteView);
        ParticulasView particulasView = findViewById(R.id.particulasView);

        particulasView.setOnTouchListener((v, event) -> {
            particulasView.generarParticulas(event.getX(), event.getY());
            return true;
        });

        findViewById(R.id.btnBackToMenu).setOnClickListener(v -> {
            Toast.makeText(this, "Regresando al menú principal...", Toast.LENGTH_SHORT).show();
            finish();
        });
    }
}
