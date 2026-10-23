# NASA Explorer App — Spring Boot & React TypeScript

A full-stack **NASA Astronomy Picture of the Day (APOD)** Explorer built with a **Spring Boot (Java)** REST backend and a **React + TypeScript (Vite)** web frontend integrated with the official **NASA Open API (`api.nasa.gov`)**.

## Features

- **Astronomy Picture of the Day (APOD):** Fetches high-resolution deep-space imagery, scientific explanations, copyright metadata, and dates via NASA's APOD API.
- **Spring Boot Proxy & Service Layer:** Clean layered backend (`NasaController`, `NasaService`, `NasaServiceImpl`, `ApodDTO`) with configured `RestTemplate` (`AppConfig`) and CORS policy (`WebConfig`).
- **Centralized Exception Handling:** Custom `NasaApiException` and `@RestControllerAdvice` `GlobalExceptionHandler` for structured upstream API error responses.
- **Modern React + TypeScript Frontend:** Responsive space-themed UI built with React, TypeScript, and Vite.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java, Spring Boot, Spring Web |
| Frontend | React, TypeScript, Vite, CSS |
| External API | NASA Open API (`https://api.nasa.gov/`) |
| Build Tool | Maven (`mvnw`) & npm |

## Project Structure

```text
.
├── NasaAPI/                                  # Spring Boot Backend
│   └── src/main/java/com/apod/NasaAPI/
│       ├── NasaApiApplication.java
│       ├── ApodDTO.java
│       ├── config/                           # AppConfig, WebConfig
│       ├── controller/                       # NasaController
│       ├── exception/                        # GlobalExceptionHandler, NasaApiException
│       └── service/                          # NasaService, NasaServiceImpl
└── frontend/                                 # React + TypeScript Frontend
    └── src/
        ├── App.tsx
        └── main.tsx
```

## Getting Started

### 1. Backend Setup (Spring Boot)

Set your NASA API key in `NasaAPI/src/main/resources/application.properties` (or pass the `NASA_API_KEY` environment variable; defaults to `DEMO_KEY`):

```properties
spring.application.name=NasaAPI
nasa.api.key=${NASA_API_KEY:DEMO_KEY}
nasa.api.base-url=https://api.nasa.gov/
```

Start the Spring Boot server:

```bash
cd NasaAPI
./mvnw spring-boot:run
```

### 2. Frontend Setup (React + TypeScript)

```bash
cd frontend
npm install
npm run dev
```
