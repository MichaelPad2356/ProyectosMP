package com.example.joinifyapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class GrupoAdapter2 extends RecyclerView.Adapter<GrupoAdapter2.GrupoViewHolder> {

    private List<Grupo> grupos;
    private OnUnirseClickListener listener;

    public GrupoAdapter2(List<Grupo> grupos, OnUnirseClickListener listener) {
        this.grupos = grupos;
        this.listener = listener;
    }

    @NonNull
    @Override
    public GrupoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_grupo2, parent, false);
        return new GrupoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull GrupoViewHolder holder, int position) {

        Grupo grupo = grupos.get(position);
        holder.bind(grupo);
    }

    @Override
    public int getItemCount() {
        return grupos.size();
    }

    public interface OnUnirseClickListener {
        void onUnirseClick(Grupo grupo);
    }

    // ViewHolder para manejar la vista de cada grupo
    public class GrupoViewHolder extends RecyclerView.ViewHolder {
        private TextView tvNombre;
        private TextView tvServicio, tvUsuarios, tvCosto, tvPolitica;
        private Button btnUnirse;

        public GrupoViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNombre = itemView.findViewById(R.id.tvGrupoNombre);
            tvServicio = itemView.findViewById(R.id.tvServicio);
            tvUsuarios = itemView.findViewById(R.id.tvUsuarios);
            tvCosto = itemView.findViewById(R.id.tvCosto);
            tvPolitica = itemView.findViewById(R.id.tvPolitica);
            btnUnirse = itemView.findViewById(R.id.btnUnirseGrupo);
        }

        public void bind(Grupo grupo) {
            tvNombre.setText("Plataforma: " + grupo.getName());
            tvServicio.setText(grupo.getServiceType());
            tvUsuarios.setText("Usuarios en el grupo: " + String.valueOf(grupo.getCurrentUsers()) + "/" + String.valueOf(grupo.getMaxUsers()));
            tvCosto.setText("Costo por usuario: $" + String.valueOf(grupo.getCostPerUser()) + ".00");
            tvPolitica.setText("Politica de pago: " + grupo.getPaymentPolicy());
            btnUnirse.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onUnirseClick(grupo);
                }
            });
        }
    }
}
