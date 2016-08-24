package com.runt9.spade.controller

import com.runt9.spade.repository.PlayerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping('/api')
@RestController
class ApiController {
    @Autowired
    PlayerRepository playerRepository;

    @RequestMapping('/player')
    getPlayers() {
        playerRepository.findAll()
    }
}
