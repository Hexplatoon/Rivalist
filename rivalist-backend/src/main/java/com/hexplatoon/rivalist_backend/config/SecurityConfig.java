package com.hexplatoon.rivalist_backend.config;

import com.hexplatoon.rivalist_backend.security.CustomUserDetailsService;
import com.hexplatoon.rivalist_backend.security.JwtAuthenticationFilter;
import com.hexplatoon.rivalist_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security configuration class that sets up JWT-based authentication,
 * authorization rules, and other security-related configurations for the application.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * Configures the security filter chain with JWT authentication, CORS, CSRF settings,
     * and endpoint authorization rules.
     *
     * @param http HttpSecurity to configure
     * @return The configured SecurityFilterChain
     * @throws Exception If configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Configure CSRF - disabling for stateless JWT authentication
            .csrf(csrf -> csrf.disable())
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Configure session management to stateless (no sessions)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints that don't require authentication
                .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            );
            
        // Add JWT filter before the standard authentication filter
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, customUserDetailsService);
    }
    /**
     * Configures the CORS (Cross-Origin Resource Sharing) policy for the application.
     *
     * @return A CorsConfigurationSource with the configured CORS settings
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:8080", "https://rivalist.com")); // Update with your frontend URLs
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    /**
     * Provides the AuthenticationManager bean for managing authentication.
     *
     * @param authConfig The AuthenticationConfiguration
     * @return The configured AuthenticationManager
     * @throws Exception If configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    /**
     * Configures the DaoAuthenticationProvider with the custom user details service
     * and password encoder.
     *
     * @return The configured DaoAuthenticationProvider
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    /**
     * Provides the password encoder bean for secure password handling.
     *
     * @return The BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
