package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.Id

@Entity
class Position {
    @Id
    Long id
    String name
    String abbr
}
