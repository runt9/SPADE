package com.runt9.spade.model.draft

import com.runt9.spade.model.player.Stat

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
class ScoringSetting {
    @Id
    @GeneratedValue
    Long id

    @ManyToOne
    Draft draft

    @ManyToOne
    Stat stat

    // Could be yards or points, so just generically name it "value"
    BigDecimal valuePerStat
}
