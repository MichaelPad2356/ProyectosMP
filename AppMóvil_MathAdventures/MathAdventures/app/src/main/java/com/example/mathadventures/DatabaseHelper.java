package com.example.mathadventures;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.content.ContentValues;
import android.database.Cursor;

public class DatabaseHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "mathadventures.db";
    private static final int DATABASE_VERSION = 2; // Incremento en la versión

    public static final String TABLE_USERS = "users";
    public static final String COLUMN_ID = "id";
    public static final String COLUMN_USERNAME = "username";
    public static final String COLUMN_LEVEL = "level"; // Columna nivel desbloqueado

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String createTable = "CREATE TABLE " + TABLE_USERS + " (" +
                COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COLUMN_USERNAME + " TEXT UNIQUE, " +
                COLUMN_LEVEL + " INTEGER DEFAULT 1)"; // Por defecto, el nivel 1 está desbloqueado
        db.execSQL(createTable);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if (oldVersion < 2) {
            String alterTable = "ALTER TABLE " + TABLE_USERS + " ADD COLUMN " + COLUMN_LEVEL + " INTEGER DEFAULT 1";
            db.execSQL(alterTable);
        }
    }

    // Método para agregar un nuevo usuario
    public boolean addUser(String username) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_USERNAME, username);

        long result = db.insert(TABLE_USERS, null, values);
        return result != -1; // Si es -1, la inserción falló
    }

    // Método para verificar si un usuario ya está registrado
    public boolean isUserRegistered(String username) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_USERS, new String[]{COLUMN_ID},
                COLUMN_USERNAME + " = ?", new String[]{username},
                null, null, null);

        boolean exists = (cursor.getCount() > 0);
        cursor.close();
        return exists;
    }

    // Método para obtener el nivel de un usuario
    public int getUserLevel(String username) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_USERS, new String[]{COLUMN_LEVEL},
                COLUMN_USERNAME + " = ?", new String[]{username},
                null, null, null);

        if (cursor != null && cursor.moveToFirst()) {
            // Verificamos que la columna existe antes de intentar obtener su valor
            int levelIndex = cursor.getColumnIndex(COLUMN_LEVEL);
            if (levelIndex != -1) {
                int level = cursor.getInt(levelIndex);
                cursor.close();
                return level;
            }
        }

        // Si no se encuentra el nivel o el usuario no existe, devolvemos el nivel 1 por defecto
        if (cursor != null) {
            cursor.close();
        }
        return 1; // Nivel por defecto si el usuario no se encuentra
    }


}
