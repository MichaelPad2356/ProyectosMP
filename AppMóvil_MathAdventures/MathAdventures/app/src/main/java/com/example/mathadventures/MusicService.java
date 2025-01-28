package com.example.mathadventures;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.IBinder;
import android.os.Binder;

import androidx.core.app.NotificationCompat;

public class MusicService extends Service {
    private MediaPlayer mediaPlayer;
    private static final int NOTIFICATION_ID = 1;
    private final IBinder binder = new LocalBinder();

    @Override
    public void onCreate() {
        super.onCreate();
        // Crear el MediaPlayer con la música de fondo
        mediaPlayer = MediaPlayer.create(this, R.raw.background_music);

        // Configurar reproducción continua
        mediaPlayer.setLooping(true);

        // Crear canal de notificación para servicios en primer plano
        createNotificationChannel();

        // Iniciar servicio en primer plano con una notificación
        Notification notification = createNotification(); // Crea la notificación
        if (notification != null) {
            startForeground(NOTIFICATION_ID, notification);
        } else {
            stopSelf(); // Detener el servicio si no se puede crear la notificación
        }
}

    private void createNotificationChannel() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "MUSIC_CHANNEL",
                    "Background Music",
                    NotificationManager.IMPORTANCE_LOW
            );

            NotificationManager notificationManager =
                    (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    private Notification createNotification() {
        try {
            return new NotificationCompat.Builder(this, "MUSIC_CHANNEL")
                    .setContentTitle("Math Adventures")
                    .setContentText("Música de fondo")
                    .setSmallIcon(R.drawable.ic_launcher_foreground)
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Iniciar reproducción si no está sonando
        if (mediaPlayer != null && !mediaPlayer.isPlaying()) {
            mediaPlayer.start();
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        // Liberar recursos al destruir el servicio
        if (mediaPlayer != null) {
            mediaPlayer.stop();
            mediaPlayer.release();
        }
        super.onDestroy();
    }


    // Métodos adicionales para control de música
    public void pauseMusic() {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.pause();
        }
    }

    public void resumeMusic() {
        if (mediaPlayer != null && !mediaPlayer.isPlaying()) {
            mediaPlayer.start();
        }
    }

    public void setVolume(float volume) {
        // Controlar volumen (0.0 a 1.0)
        if (mediaPlayer != null) {
            mediaPlayer.setVolume(volume, volume);
        }
    }

    public boolean isMusicPlaying() {
        return mediaPlayer != null && mediaPlayer.isPlaying();
    }

     public class LocalBinder extends Binder {
            public MusicService getService() {
                return MusicService.this;
            }
        }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }
    public float getVolume() {
        return mediaPlayer != null ? 1.0f : 0.0f;
    }


}