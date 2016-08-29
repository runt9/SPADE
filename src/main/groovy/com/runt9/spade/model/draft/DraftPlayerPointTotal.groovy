package com.runt9.spade.model.draft

import com.fasterxml.jackson.annotation.JsonProperty
import com.runt9.spade.model.player.Player

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = ['year', 'player_id', 'draft_id']))
class DraftPlayerPointTotal {
    @Id
    @GeneratedValue
    Long id
    Integer year
    BigDecimal value

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    Player player

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    Draft draft
}
