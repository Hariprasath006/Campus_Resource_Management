package com.example.CampusJava.controller;

import com.example.CampusJava.model.User;
import com.example.CampusJava.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    /* ✅ GET USERS */
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(repo.findAll());
    }

    /* ✅ CREATE USER */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {

        if (user.getName() == null || user.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Name is required ❌"));
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required ❌"));
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required ❌"));
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STUDENT");
        }

        if (user.getStatus() == null || user.getStatus().isBlank()) {
            user.setStatus("ACTIVE");
        }

        try {
            User savedUser = repo.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "User Registered ✅",
                    "user", savedUser
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists ❌"));
        }
    }

    /* ✅ UPDATE USER 🔥 */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody User user) {

        user.setId(id);
        User updated = repo.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "User Updated ✅",
                "user", updated
        ));
    }

    /* ✅ DELETE USER 🔥 */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {

        repo.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "User Deleted ✅"
        ));
    }
}