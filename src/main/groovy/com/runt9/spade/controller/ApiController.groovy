package com.runt9.spade.controller

import com.runt9.spade.model.Draft
import com.runt9.spade.model.LeaguePosition
import com.runt9.spade.repository.DraftRepository
import com.runt9.spade.repository.PlayerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

@RequestMapping('/api')
@RestController
class ApiController {
    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    DraftRepository draftRepository;

    @RequestMapping(value = '/player', method = RequestMethod.GET)
    getPlayers() {
        playerRepository.findAll()
    }

    @RequestMapping(value = '/draft', method = RequestMethod.POST)
    createDraft(@RequestBody Draft draft) {
        draftRepository.save(draft)
    }

    @RequestMapping(value = '/leaguePositions', method = RequestMethod.GET)
    getLeaguePositions() {
        LeaguePosition.allPositions
    }
}
