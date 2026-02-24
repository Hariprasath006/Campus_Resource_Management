package com.example.CampusJava.repository;

import com.example.CampusJava.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    List<Resource> findByType(String type);
}
