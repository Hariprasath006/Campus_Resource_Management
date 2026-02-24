package com.example.CampusJava.controller;

import com.example.CampusJava.model.User;
import com.example.CampusJava.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository repo;

    public AuthController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {

        String email = data.get("email");
        String password = data.get("password");
        String role = data.get("role");

        if (email == null || password == null || role == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Missing credentials ❌"));
        }

        Optional<User> userOptional = repo.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not found ❌"));
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(password)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid Password ❌"));
        }

        if (!user.getRole().equals(role)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Role mismatch ❌"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login Success ✅",
                "user", user
        ));
    }
}