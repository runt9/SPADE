package com.runt9.spade.model

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
class FantasyTeam {
    @Id
    @GeneratedValue
    Long id
    String abbr
    String name
    Integer draftOrder

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    Draft draft
}
