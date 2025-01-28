package com.example.joinifyapp;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiServiceBuilder {

    private static final String BASE_URL = "http://192.168.50.20:3001/";

    private static Retrofit retrofit = null;

    public static <T> T createService(Class<T> serviceClass) {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }

        return retrofit.create(serviceClass);
    }
}
