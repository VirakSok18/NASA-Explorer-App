package com.apod.NasaAPI.service;
import com.apod.NasaAPI.ApodDTO;
import com.apod.NasaAPI.exception.NasaApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;



@Service
@RequiredArgsConstructor
public class NasaServiceImpl implements NasaService {

    private final RestTemplate restTemplate;

    @Value("${nasa.api.key}")
    private String apiKey;

    @Value("${nasa.api.base-url}")
    private String baseUrl;

    @Override
    public ApodDTO getTodayApod(){
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/planetary/apod")
                .queryParam("api_key", apiKey)
                .toUriString();

        return fetchApod(url);
    }

    @Override
    public ApodDTO getApodByDate(String date){
        if (!date.matches("\\d{4}-\\d{2}-\\d{2}")){
            throw new IllegalArgumentException("Date must be in YYYY-MM-DD format");
        }

        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/planetary/apod")
                .queryParam("api_key", apiKey)
                .queryParam("date", date)
                .toUriString();

        return fetchApod(url);
    }

    private ApodDTO fetchApod(String Url){
        try{
            ApodDTO response = restTemplate.getForObject(Url, ApodDTO.class);
            if (response == null){
                throw new NasaApiException("Received empty response from NASA API");
            }
            return response;
        }
        catch (RestClientException ex){
            throw new NasaApiException("Failed to fetch data from nasa api: " + ex.getMessage(), ex);
        }

    }













}
