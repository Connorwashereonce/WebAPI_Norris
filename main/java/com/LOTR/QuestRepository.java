package com.LOTR;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Indicates that this is a Spring Data repository
public interface QuestRepository extends JpaRepository<Quest, Integer> {
    // This provides CRUD operations for the Quest entity.
}
