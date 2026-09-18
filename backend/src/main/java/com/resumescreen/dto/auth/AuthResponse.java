package com.resumescreen.dto.auth;

import com.resumescreen.entity.Role;
import lombok.Builder;

@Builder
public record AuthResponse(
        String token,
        String name,
        String email,
        Role role
) {}
