package com.runt9.spade.repository

import com.runt9.spade.model.Player
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository

interface PlayerRepository extends ElasticsearchRepository<Player, String> {
}
