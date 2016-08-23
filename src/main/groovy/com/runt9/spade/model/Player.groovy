package com.runt9.spade.model

import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document

@Document(indexName = "player")
class Player {
    @Id
    String id
    String name
    String nflTeam
    String leagueTeam
    Integer byeWeek
    Integer draftPosition
    PlayerPosition position
    Integer gamesPlayed
    Integer lastSeasonPoints
    Map<String, BigDecimal> stats
}
