package com.hexplatoon.rivalist_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

/**
 * Entity representing a user in the system.
 * This class implements UserDetails for Spring Security integration.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    // TODO : Add enum to denote user status : online, offline, in-battle
    // Not required for now
//    /**
//     * Enumeration representing the possible states of a user account.
//     */
//    public enum AccountStatus {
//        ACTIVE,       // Account is active and can be used normally
//        INACTIVE,     // Account is temporarily inactive
//        SUSPENDED,    // Account is suspended due to violations
//        PENDING,      // Account is pending activation or verification
//        DELETED       // Account is marked as deleted
//    }

    /**
     * Unique identifier for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Username used for authentication.
     * Must be unique and between 3-50 characters.
     */
    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Username can only contain letters, numbers, and ._-")
    private String username;

    /**
     * Email address of the user.
     * Must be unique and valid format.
     */
    @Column(nullable = false, unique = true, length = 100)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    /**
     * Encrypted password of the user.
     */
    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    private String password;

    /**
     * Timestamp when the user account was created.
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Not required for now
//    /**
//     * Current status of the user account.
//     * Default is ACTIVE.
//     */
//    @Column(name = "account_status", nullable = false)
//    @Enumerated(EnumType.STRING)
//    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    // Not required for now
//    /**
//     * Flag indicating whether this is the user's first login.
//     * Used for onboarding flows and initial setup.
//     */
//    @Column(name = "first_login", nullable = false)
//    private Boolean firstLogin = true;

    @Column(length = 50)
    private String firstName;

    @Column(length = 50)
    private String lastName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_picture", length = 255)
    private String profilePicture;

    @Column(nullable = false)
    @Builder.Default
    private Integer level = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer experience = 0;

    @Column(name = "typing_rating", nullable = false)
    @Builder.Default
    private Integer typingRating = 0;

    @Column(name = "css_design_rating", nullable = false)
    @Builder.Default
    private Integer cssDesignRating = 0;

    @Column(name = "codeforces_rating", nullable = false)
    @Builder.Default
    private Integer codeforcesRating = 1200;

    /**
     * Current online status of the user.
     * Default is OFFLINE.
     */
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.OFFLINE;

    /**
     * Sets default values before persisting a new user.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        // Not required for now
//        if (accountStatus == null) {
//            accountStatus = AccountStatus.ACTIVE;
//        }
//        if (firstLogin == null) {
//            firstLogin = true;
//        }
    }

    /**
     * Returns the authorities granted to the user.
     * By default, all users have ROLE_USER.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    // Not required for now

//    /**
//     * Indicates whether the user's account has expired.
//     * @return true if the user's account is valid (non-expired), false otherwise
//     */
//    @Override
//    public boolean isAccountNonExpired() {
//        return true;
//    }
//
//    /**
//     * Indicates whether the user is locked or unlocked.
//     * @return true if the user is not locked, false otherwise
//     */
//    @Override
//    public boolean isAccountNonLocked() {
//        return accountStatus != AccountStatus.SUSPENDED && accountStatus != AccountStatus.DELETED;
//    }
//
//    /**
//     * Indicates whether the user's credentials (password) has expired.
//     * @return true if the user's credentials are valid (non-expired), false otherwise
//     */
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true;
//    }
//
//    /**
//     * Indicates whether the user is enabled or disabled.
//     * @return true if the user is enabled, false otherwise
//     */
//    @Override
//    public boolean isEnabled() {
//        return accountStatus == AccountStatus.ACTIVE || accountStatus == AccountStatus.PENDING;
//    }

    public enum UserStatus {
        OFFLINE,
        ONLINE,
        IN_BATTLE
    }
}

