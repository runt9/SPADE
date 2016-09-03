package com.runt9.spade.model.draft

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
class DraftEvent {
    enum EventType {
        PLAYER_DRAFTED,
        PLAYER_UNASSIGNED
    }

    @Id
    @GeneratedValue
    Long id
    EventType type

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    Draft draft

    @ManyToOne
    DraftPlayer player
}
