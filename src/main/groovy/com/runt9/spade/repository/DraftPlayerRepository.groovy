package com.runt9.spade.repository

import com.runt9.spade.model.draft.DraftPlayer
import org.springframework.data.repository.CrudRepository

interface DraftPlayerRepository extends CrudRepository<DraftPlayer, Long> {
    List<DraftPlayer> findByDraftId(Long draftId)
    List<DraftPlayer> findByTeamId(Long teamId)
}