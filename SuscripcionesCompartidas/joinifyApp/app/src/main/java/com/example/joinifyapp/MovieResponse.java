package com.example.joinifyapp;

import java.util.List;

public class MovieResponse {
    public int page;
    public List<Movie> results;

    public static class Movie {
        public String title;
        public String poster_path;
        public String overview;
    }
}
