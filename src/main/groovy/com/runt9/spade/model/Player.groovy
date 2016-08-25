package com.runt9.spade.model

import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document

@Document(indexName = "player")
class Player {
    @Id
    String id
    String name
    Integer byeWeek
    PlayerPosition position
    NFLTeam nflTeam
    Integer gamesPlayed

    Map<String, BigDecimal> stats;
}
