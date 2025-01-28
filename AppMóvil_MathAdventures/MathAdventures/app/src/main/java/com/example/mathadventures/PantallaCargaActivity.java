package com.example.mathadventures;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class PantallaCargaActivity extends AppCompatActivity {
    private ProgressBar progressBar;
    private TextView progressText;
    private int progressStatus = 0;
    private Handler handler = new Handler();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pantalla_carga);

        progressBar = findViewById(R.id.progressBar);
        progressText = findViewById(R.id.progressText);

        // Simulación de la carga
        new Thread(new Runnable() {
            public void run() {
                while (progressStatus < 100) {
                    progressStatus += 1;
                    handler.post(new Runnable() {
                        public void run() {
                            progressBar.setProgress(progressStatus);
                            progressText.setText(progressStatus + "%");
                        }
                    });
                    try {
                        // Esto es lo que Simula el tiempo de carga
                        Thread.sleep(50);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }

                // Cuando termina la carga, cambia a la pantalla inicial, para ello se usa el intent
                if (progressStatus == 100) {
                    Intent intent = new Intent(PantallaCargaActivity.this, MainActivity.class);
                    startActivity(intent);
                    // Animación de salida
                   overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                    finish();
                }
            }
        }).start();
    }
}
