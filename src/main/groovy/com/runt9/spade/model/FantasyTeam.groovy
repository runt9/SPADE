package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.OneToOne

@Entity
class FantasyTeam {
    @Id
    Long id
    String name

    @OneToOne
    FantasyOwner fantasyOwner
}
