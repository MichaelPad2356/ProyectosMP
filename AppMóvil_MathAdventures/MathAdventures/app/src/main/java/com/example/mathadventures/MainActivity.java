package com.example.mathadventures;

import android.app.Dialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.SeekBar;
import android.widget.Switch;
import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private MusicService musicService;
    private boolean isBound = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Iniciar servicio de música
        startService(new Intent(this, MusicService.class));

        // Listener para el botón de play
        ImageView btnPlay = findViewById(R.id.btnPlay);
        btnPlay.setOnClickListener(evento);

        // Listener para el botón de información
        ImageView btnInfo = findViewById(R.id.btnInfo);
        btnInfo.setOnClickListener(v -> dialogInfo());

        // Listener para el botón de configuración
        ImageView btnSettings = findViewById(R.id.btn_settings);
        btnSettings.setOnClickListener(v -> dialogSettings());
    }

    private View.OnClickListener evento = view -> {
        Intent intent = new Intent(MainActivity.this, RegisterActivity.class);
        startActivity(intent);
    };

    private void dialogInfo() {
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_info);
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.custom_dialog_background);

        // Elementos del Dialog
        Button btnCerrar = dialog.findViewById(R.id.btnCerrar);

        // Listener para cerrar el dialog
        btnCerrar.setOnClickListener(v -> dialog.dismiss());

        // Mostrar el dialog
        dialog.show();
    }

    private void dialogSettings() {
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_settings);
        dialog.getWindow().setBackgroundDrawableResource(R.drawable.custom_dialog_background);

        // Elementos del Dialog
        Switch switchMusic = dialog.findViewById(R.id.switchMusic);
        SeekBar volumeSeekBar = dialog.findViewById(R.id.volumeSeekBar);
        Button btnCerrarSettings = dialog.findViewById(R.id.btnCerrarSettings);


        if (isBound && musicService != null) {
            switchMusic.setChecked(musicService.isMusicPlaying());
            volumeSeekBar.setProgress((int) (musicService.getVolume() * 100));

            // Manejar el evento del interruptor
            switchMusic.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    musicService.resumeMusic();
                    volumeSeekBar.setEnabled(true);
                } else {
                    musicService.pauseMusic();
                    volumeSeekBar.setEnabled(false);
                }
            });

            // Manejar el control deslizante de volumen
            volumeSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    if (fromUser) {
                        float volume = progress / 100f;
                        musicService.setVolume(volume);
                    }
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {}

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {}
            });


        } else {
            switchMusic.setEnabled(false);
            volumeSeekBar.setEnabled(false);
        }

        btnCerrarSettings.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
    }

    private ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            MusicService.LocalBinder binder = (MusicService.LocalBinder) service;
            musicService = binder.getService();
            isBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            isBound = false;
        }
    };

    @Override
    protected void onStart() {
        super.onStart();
        Intent intent = new Intent(this, MusicService.class);
        bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (isBound) {
            unbindService(connection);
            isBound = false;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (isBound) {
            unbindService(connection);
            isBound = false;
        }
        stopService(new Intent(this, MusicService.class)); // Se detiene el servicio al destruir la actividad
    }
}
