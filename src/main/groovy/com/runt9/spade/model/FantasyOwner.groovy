package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.OneToMany

@Entity
class FantasyOwner {
    @Id
    Long id
    String firstName
    String lastName
    String emailAddress
    String password

    @OneToMany
    List<FantasyTeam> fantasyTeams
}
