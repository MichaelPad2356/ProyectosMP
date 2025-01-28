package com.example.joinifyapp;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class InicioUsrActivity3 extends AppCompatActivity {
    private RecyclerView recyclerView;
    private ApiService apiService;
    int usuarioId = SessionManager.getInstance(this).getUserId();
    String usuarioIds = String.valueOf(usuarioId);
    private GrupoAdapter2 grupoAdapter;
    private List<Grupo> grupos = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inicio_usr);

        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        apiService = ApiServiceBuilder.createService(ApiService.class);

        obtenerGruposDelUsuario(usuarioIds);
    }


    private void obtenerGruposDelUsuario(String usuarioIds) {
        // Imprimir el usuarioId
        Log.d("InicioUsrActivity3", "Obteniendo grupos para usuario ID: " + usuarioId);

        Call<List<Grupo>> call = apiService.obtenerGruposDisponibles(usuarioIds);

        call.enqueue(new Callback<List<Grupo>>() {
            @Override
            public void onResponse(Call<List<Grupo>> call, Response<List<Grupo>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Grupo> grupos = response.body();
                    GrupoAdapter2 grupoAdapter = new GrupoAdapter2(grupos, new GrupoAdapter2.OnUnirseClickListener() {
                        @Override
                        public void onUnirseClick(Grupo grupo) {

                            Log.d("InicioUsrActivity3", "Intentando unir usuario ID: " + usuarioId + " al grupo ID: " + grupo.getId());
                            unirseAlGrupo(usuarioIds, grupo.getId());
                        }
                    });
                    recyclerView.setAdapter(grupoAdapter);
                } else {
                    Log.e("InicioUsrActivity3", "Error al obtener grupos: " + response.code());
                    Toast.makeText(InicioUsrActivity3.this, "No se encontraron grupos disponibles", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Grupo>> call, Throwable t) {
                Log.e("InicioUsrActivity3", "Error al realizar la solicitud", t);
                Toast.makeText(InicioUsrActivity3.this, "Error al obtener los grupos", Toast.LENGTH_LONG).show();
            }
        });
    }


    // Método para unir al grupo con el usuarioId
    private void unirseAlGrupo(String usuarioId, long groupId) {
        // Create the request object to join the group
        UnirseGrupoRequest request = new UnirseGrupoRequest(groupId, usuarioId);

        // Call to join the group
        Call<RespuestaUnirse> call = apiService.unirseAlGrupo(request);
        call.enqueue(new Callback<RespuestaUnirse>() {
            @Override
            public void onResponse(Call<RespuestaUnirse> call, Response<RespuestaUnirse> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(InicioUsrActivity3.this, "Te has unido al grupo correctamente", Toast.LENGTH_SHORT).show();


                    updateGroupAvailability(groupId); // Call the update API

                    setResult(RESULT_OK);
                    finish();
                } else {
                    Toast.makeText(InicioUsrActivity3.this, "Error al unirse al grupo", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<RespuestaUnirse> call, Throwable t) {
                Toast.makeText(InicioUsrActivity3.this, "Error al procesar la solicitud", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateGroupAvailability(long groupId) {

        Call<ResponseBody> updateCall = apiService.updateGroupAvailability((int) groupId);
        updateCall.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(InicioUsrActivity3.this, "Disponibilidad del grupo actualizada correctamente", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(InicioUsrActivity3.this, "Error al actualizar disponibilidad del grupo", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(InicioUsrActivity3.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }



}
