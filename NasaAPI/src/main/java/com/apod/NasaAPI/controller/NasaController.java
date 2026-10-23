package com.apod.NasaAPI.controller;


import com.apod.NasaAPI.ApodDTO;
import com.apod.NasaAPI.service.NasaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/nasa")
@RequiredArgsConstructor
public class NasaController {

    private final NasaService nasaService;

    @GetMapping("/apod")
    public ResponseEntity<ApodDTO> getTodayApod(){
        return  ResponseEntity.ok(nasaService.getTodayApod());
    }

    @GetMapping("/apod/{date}")
    public ResponseEntity<ApodDTO> getApodByDate(@PathVariable String date){
        return ResponseEntity.ok(nasaService.getApodByDate(date));
    }


}
