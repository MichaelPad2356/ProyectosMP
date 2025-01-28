package com.example.joinifyapp;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    @POST("/usuario")
    Call<Void> registrarUsuario(@Body Usuario usuario);

    // Endpoint para iniciar sesión
    @POST("/login")
    Call<Loginresponse> login(@Body LoginRequest loginRequest);

    // Endpoint para crear un grupo
    @POST("/api/grupos/crear")
    Call<GroupResponse> crearGrupo(@Body GrupoRequest grupoRequest);

    //Endpoint para mostrar los grupos de un usuario
    @GET("/api/grupos/usuario")
    Call<List<GrupoResponse>> obtenerGrupos(@Query("usuarioId") String usuarioId);

    // Endpoint para obtener los grupos disponibles basados en el usuarioId
    @GET("/gruposdisponibles/{usuarioId}")
    Call<List<Grupo>> obtenerGruposDisponibles(@Path("usuarioId") String usuarioId);

    // Endpoint para unirse a un grupo
    @POST("/api/grupos/unirse")
    Call<RespuestaUnirse> unirseAlGrupo(@Body UnirseGrupoRequest request);

    @POST("/api/servicio-suscripcion/guardar")
    Call<Void> saveSubscription(@Body SuscripcionRequest subscriptionRequest);

    // Endpoint for exiting the group
    @DELETE("/api/grupos/salir/{groupId}/{userId}")
    Call<Void> salirDelGrupo(@Path("groupId") String groupId, @Path("userId") int userId);

    @DELETE("/api/grupos/baja/{groupId}")
    Call<ResponseBody> unsubscribeFromGroup(@Path("groupId") int groupId);

    @PUT("/api/servicio-suscripcion/actualizar/{groupId}")
    Call<ResponseBody> updateGroupAvailability(@Path("groupId") int groupId);

    @POST("/api/pagos/simular")
    Call<PaymentResponse> simularPago(@Body PaymentRequest paymentRequest);






}

