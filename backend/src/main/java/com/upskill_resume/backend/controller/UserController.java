package com.upskill_resume.backend.controller;

import com.upskill_resume.backend.entity.User;
import com.upskill_resume.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import com.upskill_resume.backend.dto.LoginRequest;
import com.upskill_resume.backend.service.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
}

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
        public ResponseEntity<String> login(@RequestBody LoginRequest request) {

        User user = userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(token);
    }
}