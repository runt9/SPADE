package com.runt9.spade.repository

import com.runt9.spade.model.draft.Draft
import org.springframework.data.repository.CrudRepository

interface DraftRepository extends CrudRepository<Draft, Long> {
}
