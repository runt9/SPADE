package com.runt9.spade.repository

import com.runt9.spade.model.draft.DraftPlayer
import org.springframework.data.repository.PagingAndSortingRepository

interface DraftPlayerRepository extends PagingAndSortingRepository<DraftPlayer, Long> {
    List<DraftPlayer> findByDraftId(Long draftId)
}