package com.example.mathadventures;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

public class Utils {

    /**
     * Escala una imagen a las dimensiones especificadas.
     *
     * @param context El contexto actual.
     * @param resId   El ID del recurso drawable.
     * @param width   El ancho deseado.
     * @param height  La altura deseada.
     * @return Un Bitmap escalado.
     */
    public static Bitmap getScaledBitmap(Context context, int resId, int width, int height) {
        Bitmap originalBitmap = BitmapFactory.decodeResource(context.getResources(), resId);
        return Bitmap.createScaledBitmap(originalBitmap, width, height, true);
    }
}
