package com.runt9.spade.model

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository

interface PlayerRepository extends ElasticsearchRepository<Player, String> {
}
