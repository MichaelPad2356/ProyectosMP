package com.example.mathadventures;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

public class ParticulasView extends View {

    private Paint paint;
    private List<Particle> particles;
    private Random random = new Random();

    public ParticulasView(Context context) {
        super(context);
        init();
    }

    public ParticulasView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        paint = new Paint();
        paint.setStyle(Paint.Style.FILL);
        particles = new ArrayList<>();
    }

    public void generarParticulas(float x, float y) {
        particles.clear();
        for (int i = 0; i < 150; i++) { // Incrementa el número de partículas
            Particle p = new Particle(x, y, random.nextInt(20) + 5, random.nextInt(360), getRandomColor());
            particles.add(p);
        }
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        Iterator<Particle> iterator = particles.iterator();
        while (iterator.hasNext()) {
            Particle p = iterator.next();
            paint.setColor(p.color);
            paint.setAlpha(p.alpha);
            canvas.drawCircle(p.x, p.y, p.size, paint);
            p.move();
            if (p.alpha <= 0) {
                iterator.remove();
            }
        }

        if (!particles.isEmpty()) {
            postInvalidateDelayed(16); // Refresca a ~60 FPS
        }
    }

    private int getRandomColor() {
        // Colores vibrantes
        int[] colors = {Color.YELLOW, Color.RED, Color.MAGENTA, Color.BLUE, Color.CYAN, Color.GREEN};
        return colors[random.nextInt(colors.length)];
    }

    private static class Particle {
        float x, y, size, angle, speed;
        int alpha;
        int color;

        public Particle(float startX, float startY, int size, int angle, int color) {
            this.x = startX;
            this.y = startY;
            this.size = size;
            this.angle = angle;
            this.speed = 7 + new Random().nextFloat() * 8; // Velocidades más rápidas
            this.alpha = 255;
            this.color = color;
        }

        public void move() {
            x += speed * Math.cos(Math.toRadians(angle));
            y += speed * Math.sin(Math.toRadians(angle));
            alpha -= 10; // Desaparecen más lentamente
        }
    }
}
