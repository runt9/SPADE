package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.OneToOne

@Entity
class FantasyTeam {
    @Id
    @GeneratedValue
    Long id
    String abbr
    String name

    @OneToOne
    Draft draft
}
