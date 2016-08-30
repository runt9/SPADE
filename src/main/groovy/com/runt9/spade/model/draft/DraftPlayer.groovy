package com.runt9.spade.model.draft

import com.fasterxml.jackson.annotation.JsonProperty
import com.runt9.spade.model.player.Player

import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = ['draft_id', 'player_id']))
class DraftPlayer {
    @Id
    @GeneratedValue
    Long id

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    Draft draft

    @ManyToOne
    Player player

    @ManyToOne(optional = true)
    FantasyTeam team

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'draft_player_id')
    List<DraftPlayerPointTotal> playerPointTotals = [];

    Integer draftRound
}
