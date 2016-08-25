package com.runt9.spade.model

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToMany

@Entity
class FantasyOwner {
    @Id
    Long id
    String firstName
    String lastName
    String username
    String emailAddress
    String password

    @OneToMany
    @JoinColumn(name = 'fantasy_owner_id')
    List<FantasyTeam> fantasyTeams
}
