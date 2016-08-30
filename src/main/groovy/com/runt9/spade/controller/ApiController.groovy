package com.runt9.spade.controller

import com.runt9.spade.model.draft.Draft
import com.runt9.spade.model.draft.LeagueType
import com.runt9.spade.repository.DraftRepository
import com.runt9.spade.repository.PlayerRepository
import com.runt9.spade.repository.PositionRepository
import com.runt9.spade.repository.StatRepository
import com.runt9.spade.service.NflApiLoader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

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
    NflApiLoader nflApiLoader

    @RequestMapping(value = '/player', method = RequestMethod.GET)
    getPlayers() {
        playerRepository.findAll()
    }

    @RequestMapping(value = '/newDraftInfo', method = RequestMethod.GET)
    getNewDraftInformation() {
        [
                leagueTypes: LeagueType.values(),
                positions: positionRepository.findAll(),
                stats: statRepository.findAll(),
        ]
    }

    @RequestMapping(value = '/stat', method = RequestMethod.GET)
    getStats() {
        statRepository.findAll()
    }

    @RequestMapping(value = '/draft', method = RequestMethod.POST)
    createDraft(@RequestBody Draft draft) {
        draftRepository.save(draft)
    }

    @RequestMapping(value = '/draft/{draftId}', method = RequestMethod.GET)
    getDraft(@PathVariable Long draftId) {
        draftRepository.findOne(draftId)
    }

    @RequestMapping(value = '/refreshAll', method = RequestMethod.GET)
    refreshAll() {
        nflApiLoader.refreshAll()
    }
}
