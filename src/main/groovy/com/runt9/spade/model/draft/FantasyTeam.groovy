package com.runt9.spade.model.draft

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany

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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = 'team_id')
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    List<DraftPlayer> players = [];
}
