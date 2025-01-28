package com.example.joinifyapp;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface TheMovieDbApi {

    @GET("movie/popular?api_key=5c208ff4ecedc410685c70b86d4abcd9&language=en-US")
    Call<MovieResponse> getPopularMovies();
}
