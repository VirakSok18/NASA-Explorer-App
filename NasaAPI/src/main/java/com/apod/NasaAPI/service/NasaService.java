package com.apod.NasaAPI.service;

import com.apod.NasaAPI.ApodDTO;

public interface NasaService {
    ApodDTO getTodayApod();
    ApodDTO getApodByDate(String date);
}
