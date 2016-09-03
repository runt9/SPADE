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
        draftEventRepository.save(new DraftEvent(type: DraftEvent.EventType.PLAYER_DRAFTED, player: player, draft: player.draft))
    }

    void playerUnassigned(DraftPlayer player) {
        draftEventRepository.save(new DraftEvent(type: DraftEvent.EventType.PLAYER_UNASSIGNED, player: player, draft: player.draft))
    }

    List<DraftEvent> findNewEvents(Long draftId, Long fromId) {
        draftEventRepository.findByDraftIdAndIdGreaterThan(draftId, fromId)
    }

    Long getLastEventId(Long draftId) {
        draftEventRepository.findFirstByDraftIdOrderByIdDesc(draftId)?.id
    }
}
