package com.example.joinifyapp;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Registro extends AppCompatActivity {

    EditText etFullName, etEmail, etPassword;
    CheckBox cbTerms;
    Button btnCreateAccount;
    TextView tvSignIn;

    ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.registrar_usuario);


        etFullName = findViewById(R.id.etFullName);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        cbTerms = findViewById(R.id.cbTerms);
        btnCreateAccount = findViewById(R.id.btnCreateAccount);
        tvSignIn = findViewById(R.id.tvSignIn);

        // Inicializar Retrofit
        apiService = ApiClient.getClient().create(ApiService.class);


        tvSignIn.setOnClickListener(v -> {
            Intent intent = new Intent(Registro.this, Login.class);
            startActivity(intent);
        });

        // Manejar el registro del usuario
        btnCreateAccount.setOnClickListener(v -> {
            if (!cbTerms.isChecked()) {
                Toast.makeText(Registro.this, "Debes aceptar los términos", Toast.LENGTH_SHORT).show();
                return;
            }

            String fullname = etFullName.getText().toString();
            String email = etEmail.getText().toString();
            String password = etPassword.getText().toString();


            Usuario usuario = new Usuario(fullname, email, password);
            registrarUsuario(usuario);
        });
    }

    private void registrarUsuario(Usuario usuario) {
        Call<Void> call = apiService.registrarUsuario(usuario);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(Registro.this, "Registro exitoso. Ahora puedes iniciar sesión.", Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(Registro.this, Login.class);
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(Registro.this, "Error al registrar usuario", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(Registro.this, "Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
}
