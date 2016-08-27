package com.runt9.spade.controller

import com.runt9.spade.model.Draft
import com.runt9.spade.repository.DraftRepository
import com.runt9.spade.repository.PlayerRepository
import com.runt9.spade.service.NflApiLoader
import org.apache.log4j.LogManager
import org.apache.log4j.Logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

@RequestMapping('/api')
@RestController
class ApiController {
    private final static Logger logger = LogManager.getLogger(ApiController)

    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    DraftRepository draftRepository;

    @Autowired
    NflApiLoader nflApiLoader

    @RequestMapping(value = '/player', method = RequestMethod.GET)
    getPlayers() {
        playerRepository.findAll()
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
        logger.info('Beginning full refresh')
        nflApiLoader.loadPositions()
        nflApiLoader.loadStats()
        nflApiLoader.loadNflTeams()
        nflApiLoader.loadPlayers()
        logger.info('Completed full refresh')
    }
}
