package com.runt9.spade.controller

import com.runt9.spade.dto.DraftPlayerQueryDTO
import com.runt9.spade.model.draft.Draft
import com.runt9.spade.model.draft.LeagueType
import com.runt9.spade.repository.DraftRepository
import com.runt9.spade.repository.NflTeamRepository
import com.runt9.spade.repository.PlayerRepository
import com.runt9.spade.repository.PositionRepository
import com.runt9.spade.repository.StatRepository
import com.runt9.spade.service.DraftEventService
import com.runt9.spade.service.DraftPlayerService
import com.runt9.spade.service.FantasyTeamService
import com.runt9.spade.service.NflApiLoader
import com.runt9.spade.service.PlayerStatsService
import com.runt9.spade.service.SessionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import javax.servlet.http.HttpServletRequest

// TODO: Break this guy up into smaller controllers
@RequestMapping('/api')
@RestController
class ApiController {
    @Autowired
    PlayerRepository playerRepository

    @Autowired
    DraftRepository draftRepository

    @Autowired
    PositionRepository positionRepository

    @Autowired
    StatRepository statRepository

    @Autowired
    NflTeamRepository nflTeamRepository

    @Autowired
    DraftPlayerService draftPlayerService

    @Autowired
    DraftEventService draftEventService

    @Autowired
    FantasyTeamService fantasyTeamService

    @Autowired
    NflApiLoader nflApiLoader

    @Autowired
    PlayerStatsService playerStatsService

    @RequestMapping(value = '/player', method = RequestMethod.GET)
    getPlayers() {
        playerRepository.findAll()
    }

    @RequestMapping(value = '/newDraftInfo', method = RequestMethod.GET)
    getNewDraftInformation() {
        [
                leagueTypes: LeagueType.values(),
                positions: positionRepository.findAll(),
                stats: statRepository.findAll()
        ]
    }

    @RequestMapping(value = '/stat', method = RequestMethod.GET)
    getStats() {
        statRepository.findAll()
    }

    @RequestMapping(value = '/draft', method = RequestMethod.POST)
    createDraft(@RequestBody Draft draft) {
        playerStatsService.recalculatePlayerPoints(draft)
    }

    @RequestMapping(value = '/draft/{draftId}', method = RequestMethod.GET)
    getDraft(@PathVariable Long draftId, HttpServletRequest request) {
        [
                draft: draftRepository.findOne(draftId),
                nflTeams: nflTeamRepository.findAll(),
                stats: statRepository.findAll().sort { a,b -> return a.id <=> b.id },
                latestEventId: draftEventService.getLastEventId(draftId),
                taggedPlayers: SessionService.getTaggedPlayers(draftId, request)
        ]
    }

    @RequestMapping(value = '/draft/{draftId}/player', method = RequestMethod.POST)
    getDraftPlayers(@PathVariable Long draftId, @RequestBody DraftPlayerQueryDTO queryDTO, HttpServletRequest request) {
        draftPlayerService.getAllForDraftAndQuery(draftId, queryDTO, SessionService.getTaggedPlayers(draftId, request))
    }

    @RequestMapping(value = '/draft/{draftId}/player/{draftPlayerId}/tag', method = RequestMethod.POST)
    tagPlayer(@PathVariable Long draftId, @PathVariable Long draftPlayerId, HttpServletRequest request) {
        SessionService.tagPlayer(draftId, draftPlayerId, request)
    }

    @RequestMapping(value = '/draft/{draftId}/player/{draftPlayerId}/untag', method = RequestMethod.POST)
    untagPlayer(@PathVariable Long draftId, @PathVariable Long draftPlayerId, HttpServletRequest request) {
        SessionService.untagPlayer(draftId, draftPlayerId, request)
    }

    @RequestMapping(value = '/draft/player/{draftPlayerId}/team/{teamId}', method = RequestMethod.POST)
    assignPlayerToTeam(@PathVariable Long draftPlayerId, @PathVariable Long teamId) {
        draftPlayerService.assignPlayerToTeam(draftPlayerId, teamId)
    }

    @RequestMapping(value = '/draft/player/{draftPlayerId}/unassign', method = RequestMethod.POST)
    unassignPlayer(@PathVariable Long draftPlayerId) {
        draftPlayerService.unassignPlayer(draftPlayerId)
    }

    @RequestMapping(value = '/draft/{draftId}/event/new', method = RequestMethod.GET)
    getNewEvents(@PathVariable Long draftId, @RequestParam Long id) {
        draftEventService.findNewEvents(draftId, id)
    }

    @RequestMapping(value = '/team/{teamId}/player', method = RequestMethod.GET)
    getTeamPlayers(@PathVariable Long teamId) {
        fantasyTeamService.getTeamPlayers(teamId)
    }

    @RequestMapping(value = '/refreshAll', method = RequestMethod.GET)
    refreshAll() {
        nflApiLoader.refreshAll()
    }
}
