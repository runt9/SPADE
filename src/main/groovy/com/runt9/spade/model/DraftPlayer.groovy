package com.runt9.spade.model

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne
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

    @ManyToOne
    FantasyTeam team

    Integer draftRound
}
