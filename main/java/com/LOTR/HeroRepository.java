package com.LOTR;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Added for clarity, though not strictly required for interfaces

@Repository // Indicates that this is a Spring Data repository
public interface HeroRepository extends JpaRepository<Hero, Integer> {
    
}
