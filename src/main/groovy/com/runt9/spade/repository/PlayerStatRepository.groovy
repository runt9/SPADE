package com.runt9.spade.repository

import com.runt9.spade.model.player.PlayerStat
import org.springframework.data.repository.CrudRepository

interface PlayerStatRepository extends CrudRepository<PlayerStat, Long> {
}
