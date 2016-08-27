package com.runt9.spade.model

import com.fasterxml.jackson.annotation.JsonIgnore

import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.OneToOne
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

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    Player player

    @ManyToOne
    Stat stat
}
