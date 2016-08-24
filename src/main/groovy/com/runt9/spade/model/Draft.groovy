package com.runt9.spade.model

import javax.persistence.*

@Entity
class Draft {
    @Id
    Long id
    String name
    String leagueName

    @OneToOne
    FantasyOwner leagueOwner

    @ManyToMany
    @JoinTable(name = 'draft_fantasy_teams')
    List<FantasyTeam> fantasyTeams
}
