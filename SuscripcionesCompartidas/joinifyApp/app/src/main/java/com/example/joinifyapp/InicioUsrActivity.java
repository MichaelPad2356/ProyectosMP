package com.example.joinifyapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class InicioUsrActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.inicio_usr); // Layout con el header incluido

        // Obtener el header y actualizarlo
        Header header = findViewById(R.id.header);
        if (header != null) {
            header.updateHeader(this);
        }


        View headerView = findViewById(R.id.header);
        if (headerView != null) {
            Button btnLoginHeader = headerView.findViewById(R.id.btn_register);
            if (btnLoginHeader != null) {
                btnLoginHeader.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        Intent intent = new Intent(InicioUsrActivity.this, Registro.class);
                        startActivity(intent);
                    }
                });
            }
        }


        Button btnJoinCommunity = findViewById(R.id.btnJoinCommunity);
        if (btnJoinCommunity != null) {
            btnJoinCommunity.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // Redirigir a la actividad AcercaDeActivity
                    Intent intent = new Intent(InicioUsrActivity.this, AcercaDeActivity.class);
                    startActivity(intent);
                }
            });
        }


        Button btnJoinCommunityCa = findViewById(R.id.btnJoinCommunityCa);
        if (btnJoinCommunityCa != null) {
            btnJoinCommunityCa.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    Intent intent = new Intent(InicioUsrActivity.this, CaracteristicasActivity.class);
                    startActivity(intent);
                }
            });
        }

        // Retrofit initialization
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api.themoviedb.org/3/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        TheMovieDbApi api = retrofit.create(TheMovieDbApi.class);


        Call<MovieResponse> call = api.getPopularMovies();
        call.enqueue(new Callback<MovieResponse>() {
            @Override
            public void onResponse(Call<MovieResponse> call, Response<MovieResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<MovieResponse.Movie> movies = response.body().results;
                    displayMovies(movies);
                }
            }

            @Override
            public void onFailure(Call<MovieResponse> call, Throwable t) {
                // Handle failure
            }
        });
    }

    private void displayMovies(List<MovieResponse.Movie> movies) {
        // Get the reference to the ScrollView
        ScrollView contentLayout = findViewById(R.id.content);


        LinearLayout linearLayout = (LinearLayout) contentLayout.getChildAt(0);

        if (linearLayout != null) {
            for (MovieResponse.Movie movie : movies) {
                // Inflate the movie card layout
                View movieCard = getLayoutInflater().inflate(R.layout.movie_card, null);


                TextView titleText = movieCard.findViewById(R.id.movie_title);
                ImageView posterImage = movieCard.findViewById(R.id.movie_poster);

                // Set the data for the movie
                titleText.setText(movie.title);
                Glide.with(this)
                        .load("https://image.tmdb.org/t/p/w500" + movie.poster_path)
                        .into(posterImage);


                linearLayout.addView(movieCard);
            }
        }

    }
}
