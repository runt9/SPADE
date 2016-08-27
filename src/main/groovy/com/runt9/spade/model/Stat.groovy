package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.Id

@Entity
class Stat {
    @Id
    Long id
    String abbr
    String name
    String shortName
    String groupName
}
