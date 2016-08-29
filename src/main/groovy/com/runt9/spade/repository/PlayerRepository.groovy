package com.runt9.spade.repository

import com.runt9.spade.model.player.Player
import org.springframework.data.repository.CrudRepository

interface PlayerRepository extends CrudRepository<Player, Long> {
}
