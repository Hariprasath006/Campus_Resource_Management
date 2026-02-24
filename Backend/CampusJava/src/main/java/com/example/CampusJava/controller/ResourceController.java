package com.example.CampusJava.controller;

import com.example.CampusJava.model.Resource;
import com.example.CampusJava.repository.ResourceRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
@RequestMapping("/api/resources")   // ✅ FIXED PREFIX
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {

    private final ResourceRepository repo;

    public ResourceController(ResourceRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Resource> getAllResources() {
        return repo.findAll();
    }

    @GetMapping("/type/{type}")
    public List<Resource> filterByType(@PathVariable String type) {
        return repo.findByType(type);
    }

    @PostMapping
    public ResponseEntity<?> createResource(@RequestBody Resource resource) {

        Resource saved = repo.save(resource);

        return ResponseEntity.ok(Map.of(
                "message", "Resource Added ✅",
                "resource", saved
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable UUID id, @RequestBody Resource resource) {

        resource.setId(id);
        Resource updated = repo.save(resource);

        return ResponseEntity.ok(Map.of(
                "message", "Resource Updated ✅",
                "resource", updated
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable UUID id) {

        repo.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Resource Deleted ✅"
        ));
    }
}
