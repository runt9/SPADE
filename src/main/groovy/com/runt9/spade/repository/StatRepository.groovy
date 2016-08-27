package com.runt9.spade.repository

import com.runt9.spade.model.Stat
import org.springframework.data.repository.CrudRepository

interface StatRepository extends CrudRepository<Stat, Long> {
}
