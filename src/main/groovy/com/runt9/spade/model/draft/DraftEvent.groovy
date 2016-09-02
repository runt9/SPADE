package com.runt9.spade.model.draft

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
    DraftPlayer player
}
