package com.runt9.spade.model.draft

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.FetchType
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
    LeagueType leagueType

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'draft_id')
    List<FantasyTeam> fantasyTeams = []

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'draft_id')
    List<DraftPositionCount> positionCounts = []

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = 'draft_id')
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    List<DraftPlayer> draftPlayers = []

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'draft_id')
    List<ScoringSetting> scoringSettings = [];
}
