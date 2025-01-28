package com.example.mathadventures;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.AttributeSet;
import android.view.View;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class CoheteInteractivoView extends View implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private float xPos = 0, yPos = 0;
    private float coheteWidth, coheteHeight;
    private Paint paint;

    private static final int NUM_CONFETTI = 50; // Número máximo de partículas
    private List<Confetti> confettiList;
    private Random random = new Random();

    public CoheteInteractivoView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public CoheteInteractivoView(Context context) {
        super(context);
        init(context);
    }

    private void init(Context context) {
        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        coheteWidth = 200; // Ancho del cohete
        coheteHeight = 300; // Alto del cohete

        paint = new Paint();
        confettiList = new ArrayList<>();

        // Aqui están las partículas al inicio en posiciones aleatorias
        for (int i = 0; i < NUM_CONFETTI; i++) {
            float randomX = random.nextFloat() * getWidth(); // Posición aleatoria en X
            float randomY = random.nextFloat() * getHeight(); // Posición aleatoria en Y
            confettiList.add(new Confetti(randomX, randomY));
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            float deltaX = -event.values[0];
            float deltaY = event.values[1];

            xPos += deltaX * 5;
            yPos += deltaY * 5;

            xPos = Math.max(0, Math.min(xPos, getWidth() - coheteWidth));
            yPos = Math.max(0, Math.min(yPos, getHeight() - coheteHeight));

            // Actualizar movimiento del confetti
            for (Confetti confetti : confettiList) {
                confetti.update(deltaX, deltaY);
                confetti.checkBounds(getWidth(), getHeight());
            }

            invalidate();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (accelerometer != null) {
            sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_UI);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        sensorManager.unregisterListener(this);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        // Se dibuja el cohete
        canvas.drawBitmap(
                Utils.getScaledBitmap(getContext(), R.drawable.cohete, (int) coheteWidth, (int) coheteHeight),
                xPos, yPos, null
        );

        // Se dibuja el confetti
        for (Confetti confetti : confettiList) {
            paint.setColor(confetti.color);
            canvas.drawCircle(confetti.x, confetti.y, confetti.size, paint);
        }
    }

    // Clase interna para manejar el confetti
    private static class Confetti {
        float x, y, vx, vy, size;
        int color;

        public Confetti(float x, float y) {
            this.x = x;
            this.y = y;
            this.vx = (float) (Math.random() * 10 - 5); // Velocidad aleatoria en X
            this.vy = (float) (Math.random() * 10 - 5); // Velocidad aleatoria en Y
            this.size = (float) (Math.random() * 10 + 5); // Tamaño aleatorio
            this.color = getRandomColor(); // Color aleatorio
        }

        public void update(float ax, float ay) {
            vx += ax * 0.1f;
            vy += ay * 0.1f;
            x += vx;
            y += vy;
        }

        public void checkBounds(int width, int height) {
            if (x < 0 || x > width) vx = -vx; // Rebote en los bordes horizontales
            if (y < 0 || y > height) vy = -vy; // Rebote en los bordes verticales
        }

        private static int getRandomColor() {
            Random random = new Random();
            return Color.rgb(random.nextInt(256), random.nextInt(256), random.nextInt(256));
        }
    }
}
