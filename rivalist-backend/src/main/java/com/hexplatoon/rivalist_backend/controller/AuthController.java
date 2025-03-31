package com.hexplatoon.rivalist_backend.controller;

import com.hexplatoon.rivalist_backend.dto.AuthRequest;
import com.hexplatoon.rivalist_backend.dto.AuthResponse;
import com.hexplatoon.rivalist_backend.dto.RegisterRequest;
import com.hexplatoon.rivalist_backend.entity.User;
import com.hexplatoon.rivalist_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller handling authentication related API endpoints including registration, login,
 * token validation, and user information retrieval.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://rivalist.com"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint to register a new user.
     *
     * @param registerRequest The registration details of the user
     * @return ResponseEntity with the authentication token and user details
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    /**
     * Endpoint to authenticate a user and generate a JWT token.
     *
     * @param authRequest The authentication request containing credentials
     * @return ResponseEntity with the authentication token and user details
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            AuthResponse response = authService.login(authRequest);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    /**
     * Endpoint to validate a JWT token.
     *
     * @param token The JWT token to validate
     * @return ResponseEntity with the validation result
     */
    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, Boolean>> validateToken(@RequestParam String token) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isValid = authService.validateToken(token);
        response.put("valid", isValid);
        
        if (isValid) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Endpoint to get the currently authenticated user's information.
     *
     * @return ResponseEntity with the user information
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            // Don't expose the password hash in the response
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (IllegalStateException e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    /**
     * Endpoint to check if a username is available for registration.
     *
     * @param username The username to check
     * @return ResponseEntity with the availability result
     */
    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@RequestParam String username) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isAvailable = !authService.existsByUsername(username);
        response.put("available", isAvailable);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to check if an email is available for registration.
     *
     * @param email The email to check
     * @return ResponseEntity with the availability result
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailAvailability(@RequestParam String email) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isAvailable = !authService.existsByEmail(email);
        response.put("available", isAvailable);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to update a user's first login status.
     *
     * @param userId The ID of the user to update
     * @return ResponseEntity with the update result
     */
    @PostMapping("/first-login/{userId}")
    @PreAuthorize("isAuthenticated() and (authentication.principal.id == #userId or hasRole('ADMIN'))")
    public ResponseEntity<Map<String, Boolean>> updateFirstLoginStatus(@PathVariable Long userId) {
        Map<String, Boolean> response = new HashMap<>();
        boolean updated = authService.updateFirstLoginStatus(userId);
        response.put("updated", updated);
        
        if (updated) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}

