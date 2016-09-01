package com.runt9.spade.model.common

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany

@Entity
class Position {
    @Id
    Long id
    String name
    String abbr

    @JoinTable(name = 'possible_positions',
            joinColumns = [@JoinColumn(name = 'position_id', referencedColumnName = 'id')],
            inverseJoinColumns = [@JoinColumn(name = 'possible_position_id', referencedColumnName = 'id')])
    @ManyToMany(cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    List<Position> possiblePositions
}
