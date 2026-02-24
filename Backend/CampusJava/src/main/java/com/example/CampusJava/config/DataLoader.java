package com.example.CampusJava.config;

import com.example.CampusJava.model.Resource;
import com.example.CampusJava.model.User;
import com.example.CampusJava.repository.ResourceRepository;
import com.example.CampusJava.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    /* ✅ DEFAULT RESOURCES */
    @Bean
    CommandLineRunner loadResources(ResourceRepository repo) {
        return args -> {

            if (repo.count() == 0) {

                repo.save(new Resource(null, "Lab 1", "LAB", 40, "AVAILABLE"));
                repo.save(new Resource(null, "Lab 2", "LAB", 35, "AVAILABLE"));
                repo.save(new Resource(null, "Classroom A", "CLASSROOM", 60, "AVAILABLE"));
                repo.save(new Resource(null, "Event Hall", "HALL", 200, "AVAILABLE"));
                repo.save(new Resource(null, "Computer Lab", "LAB", 50, "AVAILABLE"));

                System.out.println("✅ Default Resources Loaded");
            }
        };
    }

    /* ✅ DEFAULT ADMIN 🔥 */
    @Bean
    CommandLineRunner loadAdmin(UserRepository repo) {
        return args -> {

            if (repo.findByEmail("admin@campus.com").isEmpty()) {

                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@campus.com");
                admin.setPhone("9999999999");
                admin.setPassword("admin123");
                admin.setRole("ADMIN");
                admin.setStatus("ACTIVE");

                repo.save(admin);

                System.out.println("✅ Admin Account Created");
            }
        };
    }
}