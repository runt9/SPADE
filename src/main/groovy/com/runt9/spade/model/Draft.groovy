package com.runt9.spade.model

import javax.persistence.Id
import javax.persistence.JoinTable
import javax.persistence.ManyToMany

class Draft {
    @Id
    Long id
    String name
    String leagueName

    @ManyToMany
    @JoinTable(name = 'draft_fantasy_teams')
    List<FantasyTeam> fantasyTeams
}
