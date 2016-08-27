package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany

@Entity
class Player {
    @Id
    Long id
    String name
    String injuryStatus
    BigDecimal averageDraftPosition
    Integer projectedRank
    Integer draftRank

    @ManyToOne
    Position position

    @ManyToOne(optional = true)
    NflTeam nflTeam

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = 'player_id')
    List<PlayerStat> stats = []
}
