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
    @JoinTable(name = 'draft_fantasy_teams',
            joinColumns = @JoinColumn(name = 'draft_id'),
            inverseJoinColumns = @JoinColumn(name = 'fantasy_team_id'))
    List<FantasyTeam> fantasyTeams
}
