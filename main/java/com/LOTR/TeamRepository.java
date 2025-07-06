package com.LOTR;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
public interface TeamRepository extends JpaRepository<Team, Integer> {
    // This provides CRUD operations for the Team entity.
}
