package com.ClinicaOncologica.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://127.0.0.1:5500",
                    "http://localhost:5500",
                    "http://127.0.0.1:5501",  // Porta alternativa 1
                    "http://localhost:5501",
                    "http://127.0.0.1:5502",  // Porta alternativa 2
                    "http://localhost:5502",
                    "http://127.0.0.1:5503",  // Porta alternativa 3
                    "http://localhost:5503"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}