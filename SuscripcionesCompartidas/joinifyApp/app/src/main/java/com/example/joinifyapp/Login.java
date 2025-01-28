package com.example.joinifyapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Login extends AppCompatActivity {

    EditText usernameInput, passwordInput;
    Button loginButton;

    ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.logins);


        usernameInput = findViewById(R.id.usernameInput);
        passwordInput = findViewById(R.id.passwordInput);
        loginButton = findViewById(R.id.loginButton);

        // Inicializar Retrofit
        apiService = ApiClient.getClient().create(ApiService.class);


        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String username = usernameInput.getText().toString();
                String password = passwordInput.getText().toString();

                if (username.isEmpty() || password.isEmpty()) {
                    Toast.makeText(Login.this, "Por favor completa todos los campos", Toast.LENGTH_SHORT).show();
                    return;
                }


                LoginRequest loginRequest = new LoginRequest(username, password);


                realizarLogin(loginRequest);
            }
        });
    }

    private void realizarLogin(LoginRequest loginRequest) {
        Call<Loginresponse> call = apiService.login(loginRequest);

        call.enqueue(new Callback<Loginresponse>() {
            @Override
            public void onResponse(Call<Loginresponse> call, Response<Loginresponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int userId = response.body().getUserId();
                    String username = loginRequest.getUsername();

                    // Guardar en sesión el ID y nombre del usuario
                    SessionManager.getInstance(Login.this).saveUserSession(userId, username);


                    Toast.makeText(Login.this, "Inicio de sesión exitoso", Toast.LENGTH_SHORT).show();

                    // Redirigir a la actividad principal
                    Intent intent = new Intent(Login.this, InicioUsrActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(Login.this, "Credenciales incorrectas", Toast.LENGTH_SHORT).show();
                }
            }


            @Override
            public void onFailure(Call<Loginresponse> call, Throwable t) {
                Toast.makeText(Login.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

}
