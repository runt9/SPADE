package com.runt9.spade.service

import com.runt9.spade.dto.DraftPlayerQueryDTO
import com.runt9.spade.model.draft.DraftPlayer
import com.runt9.spade.repository.DraftPlayerRepository
import com.runt9.spade.repository.PositionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.support.MutableSortDefinition
import org.springframework.beans.support.PagedListHolder
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.stereotype.Service

@Service
class DraftPlayerService {
    @Autowired
    DraftPlayerRepository draftPlayerRepository

    @Autowired
    PositionRepository positionRepository

    Page<DraftPlayer> getAllForDraftAndQuery(Long draftId, DraftPlayerQueryDTO queryDTO) {
        List<DraftPlayer> players = draftPlayerRepository.findByDraftId(draftId).findAll { player ->
            if (queryDTO.showFreeAgents != null && !queryDTO.showFreeAgents && player.player.nflTeam == null) return false
            if (queryDTO.nameSearch != null && !player.player.name.toLowerCase().contains(queryDTO.nameSearch.toLowerCase())) return false
            if (queryDTO.positionId != null && !positionRepository.findOne(queryDTO.positionId)?.possiblePositions?.collect { it.id }?.contains(player.player.position.id)) return false
            if (queryDTO.nflTeamId != null && player.player.nflTeam?.id != queryDTO.nflTeamId) return false
            if (queryDTO.available != null && (player.team == null) != queryDTO.available) return false
            // TODO: Tagged: if (queryDTO.tagged != null && ) return false

            return true
        }

        Boolean alreadySorted = false
        if (queryDTO.sortProperty != null) {
            if (queryDTO.sortProperty.startsWith('points')) {
                Integer pointsYear = queryDTO.sortProperty.split('\\.')[1].toInteger()
                players = players.sort { a, b ->
                    BigDecimal v1 = a.playerPointTotals.find { it.year == pointsYear }?.value
                    BigDecimal v2 = b.playerPointTotals.find { it.year == pointsYear }?.value

                    Integer result
                    if (v1 != null) {
                        result = (v2 != null ? v1 <=> v2 : 1);
                    } else {
                        result = (v2 != null ? -1 : 0);
                    }

                    return queryDTO.ascending ? result : -result
                }

                alreadySorted = true
            } else if (queryDTO.sortProperty.startsWith('stat')) {
                List<String> splitStr = queryDTO.sortProperty.split('\\.')
                Integer statsYear = splitStr[1].toInteger()
                Long statId = splitStr[2].toLong()

                players = players.sort { a, b ->
                    BigDecimal v1 = a.player.stats.find { it.year == statsYear && it.stat?.id == statId }?.value
                    BigDecimal v2 = b.player.stats.find { it.year == statsYear && it.stat?.id == statId }?.value

                    Integer result
                    if (v1 != null) {
                        result = (v2 != null ? v1 <=> v2 : 1);
                    } else {
                        result = (v2 != null ? -1 : 0);
                    }

                    return queryDTO.ascending ? result : -result
                }

                alreadySorted = true
            }
        }

        PagedListHolder<DraftPlayer> playerPagedList = new PagedListHolder<>(players)
        if (!alreadySorted && queryDTO.sortProperty != null) {
            playerPagedList.setSort(new MutableSortDefinition(queryDTO.sortProperty, true, queryDTO.ascending))
            playerPagedList.resort()
        }

        playerPagedList.setPageSize(queryDTO.pageSize)
        playerPagedList.setPage(queryDTO.page - 1)

        new PageImpl<DraftPlayer>(playerPagedList.getPageList(), null, players.size())
    }
}
