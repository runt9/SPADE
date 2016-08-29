package com.runt9.spade.model.player

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = ['year', 'player_id', 'stat_id']))
class PlayerStat {
    @Id
    @GeneratedValue
    Long id
    Integer year
    BigDecimal value

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    Player player

    @ManyToOne
    Stat stat
}
