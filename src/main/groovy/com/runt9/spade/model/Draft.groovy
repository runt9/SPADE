package com.runt9.spade.model

import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToMany
// TODO: Scoring settings. Let's do all of them

@Entity
class Draft {
    @Id
    @GeneratedValue
    Long id
    String leagueName

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'draft_id')
    List<FantasyTeam> fantasyTeams = []

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'draft_id')
    List<DraftPositionCount> draftPositionCounts = []

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'draft_id')
    List<DraftPlayer> draftPlayers = []
}
