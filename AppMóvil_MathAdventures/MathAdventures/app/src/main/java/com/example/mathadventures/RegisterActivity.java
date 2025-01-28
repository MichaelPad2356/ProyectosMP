package com.example.mathadventures;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class RegisterActivity extends AppCompatActivity {

    private EditText etUserName;
    private Button btnRegister, btnLogin;
    private DatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        etUserName = findViewById(R.id.etUserName);
        btnRegister = findViewById(R.id.btnRegister);
        btnLogin = findViewById(R.id.btnLogin);

        dbHelper = new DatabaseHelper(this);  // Se inicializa el DatabaseHelper

        btnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String userName = etUserName.getText().toString().trim();
                if (!userName.isEmpty()) {
                    if (registerUser(userName)) {
                        Toast.makeText(RegisterActivity.this, "Usuario registrado correctamente",
                         Toast.LENGTH_SHORT).show();

                        // Guardar el nombre de usuario en SharedPreferences
                        SharedPreferences prefs = getSharedPreferences("ProgresoUsuario",
                         MODE_PRIVATE);
                        SharedPreferences.Editor editor = prefs.edit();
                        editor.putString("username", userName);  // Guardar el nombre de usuario
                        editor.apply();  // Aplicar los cambios

                        // Redirigir a la pantalla de niveles después de registrarse
                        Intent intent = new Intent(RegisterActivity.this, LevelsActivity.class);
                        startActivity(intent);
                        finish();  // Finaliza la actividad de registro
                    } else {
                        Toast.makeText(RegisterActivity.this, "El usuario ya existe",
                        Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(RegisterActivity.this, "Por favor, ingresa un nombre",
                    Toast.LENGTH_SHORT).show();
                }
            }
        });

        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String userName = etUserName.getText().toString().trim();
                if (!userName.isEmpty()) {
                    if (isUserRegistered(userName)) {
                        // Guardar el nombre de usuario en SharedPreferences para sesión futura
                        SharedPreferences prefs = getSharedPreferences("ProgresoUsuario",
                        MODE_PRIVATE);
                        SharedPreferences.Editor editor = prefs.edit();
                        editor.putString("username", userName);
                        editor.apply();

                        Toast.makeText(RegisterActivity.this, "Bienvenido de nuevo, " + userName,
                        Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(RegisterActivity.this, LevelsActivity.class);
                        startActivity(intent);
                    } else {
                        Toast.makeText(RegisterActivity.this, "El usuario no está registrado",
                        Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(RegisterActivity.this, "Por favor, ingresa un nombre",
                    Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    // Método para registrar un nuevo usuario en la base de datos
    private boolean registerUser(String userName) {
        if (!isUserRegistered(userName)) {
            // Si el usuario no está registrado, lo agregamos a la base de datos
            return dbHelper.addUser(userName);
        }
        return false;  // Si el usuario ya existe, no lo registramos
    }

    // Método para verificar si el usuario ya está registrado en la base de datos
    private boolean isUserRegistered(String userName) {
        return dbHelper.isUserRegistered(userName);
    }
}