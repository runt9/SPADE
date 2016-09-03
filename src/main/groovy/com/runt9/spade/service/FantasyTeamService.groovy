package com.runt9.spade.service

import com.runt9.spade.model.draft.DraftPlayer
import com.runt9.spade.repository.FantasyTeamRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FantasyTeamService {
    @Autowired
    FantasyTeamRepository fantasyTeamRepository

    List<DraftPlayer> getTeamPlayers(Long teamId) {
        fantasyTeamRepository.findOne(teamId)?.players
    }
}
