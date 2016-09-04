package com.runt9.spade.repository

import com.runt9.spade.model.draft.FantasyTeam
import org.springframework.data.repository.CrudRepository

interface FantasyTeamRepository extends CrudRepository<FantasyTeam, Long> {
    List<FantasyTeam> findByDraftId(Long draftId)
}