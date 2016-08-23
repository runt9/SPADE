package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.Id

@Entity
class NFLTeam {
    @Id
    Long id
    String name
    String shortName
}
