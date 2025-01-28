package com.example.joinifyapp;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.stripe.android.ApiResultCallback;
import com.stripe.android.Stripe;
import com.stripe.android.model.CardParams;
import com.stripe.android.model.PaymentMethod;
import com.stripe.android.view.CardInputWidget;
import com.stripe.android.model.PaymentMethodCreateParams;


import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GrupoAdapter extends RecyclerView.Adapter<GrupoAdapter.ViewHolder> {

    private List<GrupoResponse> grupos;
    ApiService apiService;
    ApiService apiService2 = ApiClient.getApiService();
    ApiService apiService3 = ApiClient.getApiService();

    public GrupoAdapter(List<GrupoResponse> grupos) {
        this.grupos = grupos;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_grupo, parent, false);
        return new ViewHolder(view);
    }


    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        GrupoResponse grupo = grupos.get(position);
        holder.nombreGrupo.setText(grupo.getName());
        holder.tipoServicio.setText("Plataforma: " + grupo.getServiceType());
        holder.maxUsuarios.setText("Usuarios en el grupo: " + String.valueOf(grupo.getCurrentUsers()) + "/" + grupo.getMaxUsers());
        holder.costoUsuarios.setText("Costo por usuario: " + grupo.getCostPerUser());
        holder.politicaPago.setText("Politica de pago: " + grupo.getPaymentPolicy());

        // Get user ID and group ID
        int userId = SessionManager.getInstance(holder.itemView.getContext()).getUserId();
        String groupId = String.valueOf(grupo.getId());


        if (grupo.getCreatedAt() != null) {

            holder.btnExit.setVisibility(View.GONE); // Hide "Exit" button
            holder.btnUnsubscribe.setVisibility(View.VISIBLE);
            holder.btnPay.setVisibility(View.VISIBLE);
        } else if (grupo.getJoinedAt() != null) {

            holder.btnExit.setVisibility(View.VISIBLE);
            holder.btnUnsubscribe.setVisibility(View.GONE);
            holder.btnPay.setVisibility(View.VISIBLE);
        } else {

            holder.btnExit.setVisibility(View.GONE);
            holder.btnUnsubscribe.setVisibility(View.GONE);
            holder.btnPay.setVisibility(View.GONE);
        }


        holder.btnExit.setOnClickListener(v -> {

            apiService2.salirDelGrupo(groupId, userId).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(holder.itemView.getContext(), "Has salido del grupo correctamente", Toast.LENGTH_SHORT).show();

                        // Call API to update group availability
                        apiService3.updateGroupAvailability(Integer.parseInt(groupId)).enqueue(new Callback<ResponseBody>() {
                            @Override
                            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                                if (response.isSuccessful()) {
                                    Toast.makeText(holder.itemView.getContext(), "Disponibilidad del grupo actualizada", Toast.LENGTH_SHORT).show();
                                } else {
                                    Toast.makeText(holder.itemView.getContext(), "Error al actualizar disponibilidad", Toast.LENGTH_SHORT).show();
                                }

                                // Finalizar la actividad actual
                                Activity activity = (Activity) holder.itemView.getContext();
                                activity.finish();
                            }

                            @Override
                            public void onFailure(Call<ResponseBody> call, Throwable t) {
                                Toast.makeText(holder.itemView.getContext(), "Error de conexión al actualizar: " + t.getMessage(), Toast.LENGTH_SHORT).show();

                                // Finalizar la actividad actual
                                Activity activity = (Activity) holder.itemView.getContext();
                                activity.finish();
                            }
                        });
                    } else {
                        Toast.makeText(holder.itemView.getContext(), "Error al salir del grupo", Toast.LENGTH_SHORT).show();

                        // Finalizar la actividad actual
                        Activity activity = (Activity) holder.itemView.getContext();
                        activity.finish();
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Toast.makeText(holder.itemView.getContext(), "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        });



        // Set up "Unsubscribe" button action
        holder.btnUnsubscribe.setOnClickListener(v -> {
            // Call the unsubscribe API using ApiClient
            ApiClient.getApiService().unsubscribeFromGroup(grupo.getId()).enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(holder.itemView.getContext(), "Te has dado de baja del grupo exitosamente", Toast.LENGTH_SHORT).show();
                        // Finalizar la actividad actual
                        Activity activity = (Activity) holder.itemView.getContext();
                        activity.finish();

                    } else {
                        Toast.makeText(holder.itemView.getContext(), "Error: No se puede dar de baja el grupo hasta la fecha límite!", Toast.LENGTH_SHORT).show();
                        // Finalizar la actividad actual
                        Activity activity = (Activity) holder.itemView.getContext();
                        activity.finish();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(holder.itemView.getContext(), "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        });



        holder.btnPay.setOnClickListener(v -> {
            // Initialize Stripe CardInputWidget
            CardInputWidget cardInputWidget = holder.itemView.findViewById(R.id.cardInputWidget);

            // Retrieve PaymentMethodCreateParams from the card input
            PaymentMethodCreateParams params = cardInputWidget.getPaymentMethodCreateParams();

            if (params == null) {
                Toast.makeText(holder.itemView.getContext(), "Invalid card details", Toast.LENGTH_SHORT).show();
                return;
            }

            // Initialize Stripe instance with your public key
            Stripe stripe = new Stripe(
                    holder.itemView.getContext(),
                    "pk_test_51QTYY1KKAL9Zx73kVaH7pAwFyqaSPByJFrZCQKpfzLwRgE9WTWHx6lJxKfXkhK3dgOCBTFlmSGHjBUvtJJyOSM7r00PzjBxalJ"
            );

            // Create a PaymentMethod
            stripe.createPaymentMethod(
                    params,
                    new ApiResultCallback<PaymentMethod>() {
                        @Override
                        public void onSuccess(PaymentMethod result) {
                            // Handle success: send PaymentMethod.id to your backend
                            Toast.makeText(holder.itemView.getContext(), "PaymentMethod created: " + result.id, Toast.LENGTH_SHORT).show();

                            // Create PaymentRequest with necessary data
                            PaymentRequest paymentRequest = new PaymentRequest(
                                    userId,
                                    grupo.getId(),
                                    grupo.getCostPerUser(),
                                    result.id
                            );


                            ApiClient.getApiService().simularPago(paymentRequest).enqueue(new Callback<PaymentResponse>() {
                                @Override
                                public void onResponse(Call<PaymentResponse> call, Response<PaymentResponse> response) {
                                    if (response.isSuccessful()) {

                                        Toast.makeText(holder.itemView.getContext(), "Pago realizado exitosamente", Toast.LENGTH_SHORT).show();
                                    } else {

                                        Toast.makeText(holder.itemView.getContext(), "Error al realizar el pago", Toast.LENGTH_SHORT).show();
                                    }
                                }

                                @Override
                                public void onFailure(Call<PaymentResponse> call, Throwable t) {

                                    Toast.makeText(holder.itemView.getContext(), "Error en la conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                }
                            });
                        }

                        @Override
                        public void onError(Exception e) {
                            // Handle error
                            Toast.makeText(holder.itemView.getContext(), "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    }
            );
        });



    }


    @Override
    public int getItemCount() {
        return grupos.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView nombreGrupo, tipoServicio, maxUsuarios, costoUsuarios, politicaPago, btnPay, btnExit, btnUnsubscribe;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            nombreGrupo = itemView.findViewById(R.id.nombreGrupo);
            tipoServicio = itemView.findViewById(R.id.tipoServicio);
            maxUsuarios = itemView.findViewById(R.id.maxUsuarios);
            costoUsuarios = itemView.findViewById(R.id.costoUsuarios);
            politicaPago = itemView.findViewById(R.id.politicaPago);
            btnPay = itemView.findViewById(R.id.btnPay);
            btnExit = itemView.findViewById(R.id.btnExit);
            btnUnsubscribe = itemView.findViewById(R.id.btnUnsubscribe);


        }
    }
}
