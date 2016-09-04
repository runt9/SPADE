package com.runt9.spade.repository

import com.runt9.spade.model.player.Stat
import org.springframework.data.repository.CrudRepository

interface StatRepository extends CrudRepository<Stat, Long> {
}
