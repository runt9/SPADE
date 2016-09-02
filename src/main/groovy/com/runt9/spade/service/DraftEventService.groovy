package com.runt9.spade.service

import com.runt9.spade.model.draft.DraftEvent
import com.runt9.spade.model.draft.DraftPlayer
import com.runt9.spade.repository.DraftEventRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DraftEventService {
    @Autowired
    DraftEventRepository draftEventRepository

    void playerDrafted(DraftPlayer player) {
        draftEventRepository.save(new DraftEvent(type: DraftEvent.EventType.PLAYER_DRAFTED, player: player))
    }

    void playerUnassigned(DraftPlayer player) {
        draftEventRepository.save(new DraftEvent(type: DraftEvent.EventType.PLAYER_UNASSIGNED, player: player))
    }
}
