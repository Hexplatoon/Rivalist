package com.hexplatoon.rivalist_backend.repository;

import com.hexplatoon.rivalist_backend.entity.Battle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BattleRepository extends JpaRepository<Battle, Long> {
}
