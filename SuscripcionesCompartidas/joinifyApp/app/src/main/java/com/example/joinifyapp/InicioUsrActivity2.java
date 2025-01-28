package com.example.joinifyapp;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class InicioUsrActivity2 extends AppCompatActivity {

    private RecyclerView recyclerView;
    private GrupoAdapter grupoAdapter;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inicio_usr);

        // Configurar RecyclerView
        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));


        int usuarioId = SessionManager.getInstance(this).getUserId();
        String usuarioIds = String.valueOf(usuarioId);


        apiService = ApiClient.getClient().create(ApiService.class);


        Log.d("InicioUsrActivity2", "usuarioId: " + usuarioId);

        // Realizar la petición al servidor
        obtenerGruposDelUsuario(usuarioIds);
    }


    private void obtenerGruposDelUsuario(String usuarioIds) {
        Call<List<GrupoResponse>> call = apiService.obtenerGrupos(usuarioIds);

        call.enqueue(new Callback<List<GrupoResponse>>() {
            @Override
            public void onResponse(Call<List<GrupoResponse>> call, Response<List<GrupoResponse>> response) {
                Log.d("Respuesta", "Código de respuesta: " + response.code());

                if (response.isSuccessful() && response.body() != null && !response.body().isEmpty()) {
                    // Si la respuesta contiene grupos, se configuran en el RecyclerView
                    List<GrupoResponse> grupos = response.body();
                    grupoAdapter = new GrupoAdapter(grupos);
                    recyclerView.setAdapter(grupoAdapter);
                } else {

                    Toast.makeText(InicioUsrActivity2.this, "Actualmente no tienes ningún grupo", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<GrupoResponse>> call, Throwable t) {
                // En caso de error en la petición
                Toast.makeText(InicioUsrActivity2.this, "Actualmente no tienes ningún grupo", Toast.LENGTH_SHORT).show();
            }
        });
    }


}
