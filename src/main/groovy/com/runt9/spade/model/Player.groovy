package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.OneToOne

@Entity
class Player {
    @Id
    Long id
    String name
    Integer byeWeek
    Integer draftPosition
    PlayerPosition position
    Integer gamesPlayed

    @OneToOne
    NFLTeam nflTeam

    @OneToOne
    FantasyTeam fantasyTeam

    // TODO: Stats
}
