package com.hexplatoon.rivalist_backend.service;

import com.hexplatoon.rivalist_backend.dto.AuthRequest;
import com.hexplatoon.rivalist_backend.dto.AuthResponse;
import com.hexplatoon.rivalist_backend.dto.RegisterRequest;
import com.hexplatoon.rivalist_backend.entity.User;
import com.hexplatoon.rivalist_backend.exception.InvalidJwtAuthenticationException;
import com.hexplatoon.rivalist_backend.repository.UserRepository;
import com.hexplatoon.rivalist_backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_SUSPENDED = "SUSPENDED";
    public static final String STATUS_DEACTIVATED = "DEACTIVATED";

    @Transactional
    public AuthResponse register(@Valid RegisterRequest request) {
        validateRegistrationData(request);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setAccountStatus(User.AccountStatus.valueOf(STATUS_ACTIVE));
        user.setFirstLogin(true);

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.createToken(
                savedUser.getUsername(),
                savedUser.getAuthorities()
        );

        Date expirationDate = jwtTokenProvider.extractExpiration(token);
        LocalDateTime tokenExpiresAt = expirationDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        List<String> roles = savedUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .roles(roles)
                .accountStatus(String.valueOf(savedUser.getAccountStatus()))
                .createdAt(savedUser.getCreatedAt())
                .tokenExpiresAt(tokenExpiresAt)
                .firstLogin(savedUser.getFirstLogin())
                .build();
    }

    private void validateRegistrationData(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse login(@Valid AuthRequest request) {
        try {
            User user = findUserByLoginIdentifier(request.getLoginIdentifier());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtTokenProvider.createToken(
                    user.getUsername(),
                    user.getAuthorities()
            );

            Date expirationDate = jwtTokenProvider.extractExpiration(token);
            LocalDateTime tokenExpiresAt = expirationDate.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            boolean isFirstLogin = user.getFirstLogin();
            if (isFirstLogin) {
                updateFirstLoginStatus(user.getId());
            }

            List<String> roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .roles(roles)
                    .accountStatus(String.valueOf(user.getAccountStatus()))
                    .createdAt(user.getCreatedAt())
                    .tokenExpiresAt(tokenExpiresAt)
                    .firstLogin(isFirstLogin)
                    .build();
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username/email or password");
        }
    }

    private User findUserByLoginIdentifier(String loginIdentifier) {
        Optional<User> userByUsername = userRepository.findByUsername(loginIdentifier);
        if (userByUsername.isPresent()) {
            return userByUsername.get();
        }

        Optional<User> userByEmail = userRepository.findByEmail(loginIdentifier);
        if (userByEmail.isPresent()) {
            return userByEmail.get();
        }

        throw new IllegalArgumentException("User not found with provided username or email");
    }

    public boolean validateToken(String token) {
        try {
            return jwtTokenProvider.validateToken(token);
        } catch (InvalidJwtAuthenticationException e) {
            return false;
        }
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            throw new IllegalStateException("No authenticated user found");
        }

        String username;
        if (authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        } else if (authentication.getPrincipal() instanceof String) {
            username = (String) authentication.getPrincipal();
        } else {
            username = authentication.getName();
        }

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
    }

    @Transactional
    public boolean updateFirstLoginStatus(Long userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setFirstLogin(false);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public boolean updateAccountStatus(Long userId, String status) {
        validateAccountStatus(status);

        return userRepository.findById(userId)
                .map(user -> {
                    user.setAccountStatus(User.AccountStatus.valueOf(status));
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    private void validateAccountStatus(String status) {
        if (!STATUS_ACTIVE.equals(status) &&
                !STATUS_PENDING.equals(status) &&
                !STATUS_SUSPENDED.equals(status) &&
                !STATUS_DEACTIVATED.equals(status)) {
            throw new IllegalArgumentException("Invalid account status: " + status);
        }
    }

    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public String getUsernameFromToken(String token) {
        return jwtTokenProvider.extractUsername(token);
    }
}