package com.runt9.spade.repository

import com.runt9.spade.model.draft.DraftEvent
import org.springframework.data.repository.CrudRepository

interface DraftEventRepository extends CrudRepository<DraftEvent, Long> {
    List<DraftEvent> findByDraftIdAndIdGreaterThan(Long draftId, Long id)
    DraftEvent findFirstByDraftIdOrderByIdDesc(Long draftId)
}