package com.example.joinifyapp;

import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CrearGrupoActivity extends AppCompatActivity {

    TextInputEditText etNombreGrupo, etNumUsuarios, etCostoUsuario;
    AutoCompleteTextView platformSpinner, paymentPolicySpinner;
    MaterialButton btnCreateGroup;
    ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.crear_grupo);

        // Inicializar Retrofit
        apiService = ApiClient.getClient().create(ApiService.class);

        // Asociar vistas
        etNombreGrupo = findViewById(R.id.etNombreGrupo);
        platformSpinner = findViewById(R.id.platformSpinner);
        etNumUsuarios = findViewById(R.id.etNumUsuarios);
        etCostoUsuario = findViewById(R.id.etCostoUsuario);
        paymentPolicySpinner = findViewById(R.id.paymentPolicySpinner);
        btnCreateGroup = findViewById(R.id.btnCreateGroup);

        // Configurar opciones para los Spinners
        setupSpinners();

        // Configurar evento del botón
        btnCreateGroup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                crearGrupo();
            }
        });
    }

    private void setupSpinners() {

        String[] plataformas = {"Netflix", "Disney+", "Spotify", "HBO"};
        String[] politicas = {"Mensual", "Anual"};

        ArrayAdapter<String> platformAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, plataformas);
        platformSpinner.setAdapter(platformAdapter);

        ArrayAdapter<String> policyAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, politicas);
        paymentPolicySpinner.setAdapter(policyAdapter);
    }

    private void crearGrupo() {
        // Obtener datos del formulario
        String nombreGrupo = etNombreGrupo.getText().toString();
        String plataforma = platformSpinner.getText().toString();
        String numUsuarios = etNumUsuarios.getText().toString();
        String costoUsuario = etCostoUsuario.getText().toString();
        String politicaPago = paymentPolicySpinner.getText().toString();

        // Validar campos
        if (nombreGrupo.isEmpty() || plataforma.isEmpty() || numUsuarios.isEmpty() || costoUsuario.isEmpty() || politicaPago.isEmpty()) {
            Toast.makeText(this, "Por favor completa todos los campos", Toast.LENGTH_SHORT).show();
            return;
        }

        // Obtener el ID del usuario logueado
        int userId = SessionManager.getInstance(this).getUserId();

        // Crear objeto de solicitud
        GrupoRequest grupoRequest = new GrupoRequest(
                nombreGrupo,
                plataforma,
                Integer.parseInt(numUsuarios),
                Double.parseDouble(costoUsuario),
                politicaPago,
                userId
        );

        // Enviar datos al servidor para crear el grupo
        apiService.crearGrupo(grupoRequest).enqueue(new Callback<GroupResponse>() {
            @Override
            public void onResponse(Call<GroupResponse> call, Response<GroupResponse> response) {
                if (response.isSuccessful()) {
                    GroupResponse groupResponse = response.body();
                    if (groupResponse != null) {
                        int groupId = groupResponse.getGroupId();
                        guardarSuscripcion(plataforma, Double.parseDouble(costoUsuario), groupId);
                        Toast.makeText(CrearGrupoActivity.this, "Grupo creado exitosamente", Toast.LENGTH_SHORT).show();
                        finish();
                    } else {
                        Toast.makeText(CrearGrupoActivity.this, "Error: Respuesta vacía", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(CrearGrupoActivity.this, "Error al crear el grupo", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<GroupResponse> call, Throwable t) {
                Toast.makeText(CrearGrupoActivity.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

    }

    private void guardarSuscripcion(String serviceType, double cost, int groupId) {
        // Crear objeto para la suscripción
        SuscripcionRequest suscripcionRequest = new SuscripcionRequest(
                serviceType,
                cost,
                "SI", // Disponibilidad: 'SI'
                groupId
        );

        // Llamar al API para guardar la suscripción
        apiService.saveSubscription(suscripcionRequest).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(CrearGrupoActivity.this, "Suscripción guardada exitosamente", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(CrearGrupoActivity.this, "Error al guardar la suscripción", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(CrearGrupoActivity.this, "Error de conexión al guardar suscripción: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }




}
