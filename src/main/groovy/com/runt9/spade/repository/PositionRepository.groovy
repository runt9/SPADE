package com.runt9.spade.repository

import com.runt9.spade.model.Position
import org.springframework.data.repository.CrudRepository

interface PositionRepository extends CrudRepository<Position, Long> {
    Position findByAbbr(String abbr)
}
