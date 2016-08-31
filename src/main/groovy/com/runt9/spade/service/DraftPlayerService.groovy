package com.runt9.spade.service

import com.runt9.spade.dto.DraftPlayerQueryDTO
import com.runt9.spade.model.draft.DraftPlayer
import com.runt9.spade.repository.DraftPlayerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class DraftPlayerService {
    @Autowired
    DraftPlayerRepository draftPlayerRepository

    Page<DraftPlayer> getAllForDraftAndQuery(Long draftId, Pageable pageable, DraftPlayerQueryDTO queryDTO) {
        List<DraftPlayer> players = draftPlayerRepository.findByDraftId(draftId).findAll {
            if (queryDTO.nameSearch != null && it.player.name.contains(queryDTO.nameSearch)) return false
            if (queryDTO.positionId != null && it.player.position.id != queryDTO.positionId) return false
            if (queryDTO.nflTeamId != null && it.player.nflTeam.id != queryDTO.nflTeamId) return false
            if (queryDTO.available != null && (it.team == null) != queryDTO.available) return false
            // TODO: Tagged: if (queryDTO.tagged != null && ) return false
            return true
        }

        new PageImpl<DraftPlayer>(players, pageable, players.size())
    }
}
