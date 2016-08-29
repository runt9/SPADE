package com.runt9.spade.service

import com.runt9.spade.model.common.NflTeam
import com.runt9.spade.model.player.Player
import com.runt9.spade.model.player.PlayerStat
import com.runt9.spade.model.common.Position
import com.runt9.spade.model.player.Stat
import com.runt9.spade.repository.NflTeamRepository
import com.runt9.spade.repository.PlayerRepository
import com.runt9.spade.repository.PlayerStatRepository
import com.runt9.spade.repository.PositionRepository
import com.runt9.spade.repository.StatRepository
import groovy.json.JsonSlurper
import org.apache.log4j.LogManager
import org.apache.log4j.Logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NflApiLoader {
    private final static Logger logger = LogManager.getLogger(NflApiLoader)
    private final static APP_KEY = 'SPADE'
    private final static POSITION_CATEGORIES = 'O,K,DT'
    private final static API_BASE = 'http://api.fantasy.nfl.com/v2'

    @Autowired
    StatRepository statRepository

    @Autowired
    NflTeamRepository nflTeamRepository

    @Autowired
    PositionRepository positionRepository

    @Autowired
    PlayerRepository playerRepository

    @Autowired
    PlayerStatRepository playerStatRepository

    private static URL buildUrl(String path) {
        buildUrl(path, [:])
    }

    private static URL buildUrl(String path, Map<String, String> queryParams) {
        queryParams.put('appKey', APP_KEY)
        String queryString = queryParams.collect { "$it.key=$it.value" } join("&")
        "${API_BASE}/${path}?${queryString}".toURL()
    }

    private static getUrlJson(URL url) {
        new JsonSlurper().parse(url)
    }

    void loadStats() {
        logger.info('Reloading stats')
        statRepository.deleteAll()
        URL statsUrl = buildUrl('game/stats')
        List<Stat> stats = getUrlJson(statsUrl)?.games?.'102016'?.stats?.collect { id, Map stat ->
            logger.debug("Processing stat ${stat?.name}")
            new Stat(
                    id: id as Long,
                    abbr: stat?.abbr,
                    name: stat?.name,
                    shortName: stat?.shortName,
                    groupName: stat?.groupName,
                    scoringType: stat?.scoringType
            )
        }
        statRepository.save(stats)
    }

    void loadNflTeams() {
        logger.info('Reloading NFL Teams')
        nflTeamRepository.deleteAll()
        URL scheduleUrl = buildUrl('nfl/schedule')
        List<NflTeam> teams = getUrlJson(scheduleUrl)?.nflTeams?.collect { id, Map team ->
            logger.debug("Processing team ${team?.abbr}")
            new NflTeam(
                    id: id as Long,
                    abbr: team?.abbr,
                    city: team?.city,
                    nickName: team?.nickName,
                    byeWeek: team?.byeWeek as Integer
            )
        }
        nflTeamRepository.save(teams)
    }

    void loadPositions() {
        logger.info('Reloading positions')
        positionRepository.deleteAll()
        URL rosterSlotsUrl = buildUrl('game/rosterslots')
        List<Position> positions = getUrlJson(rosterSlotsUrl)?.games?.'102016'?.rosterSlots?.collect { id, Map position ->
            logger.debug("Processing position ${position?.name}")
            new Position(id: id as Long, abbr: position?.abbr, name: position?.name)
        }

        positionRepository.save(positions)
    }

    void loadPlayers() {
        logger.info('Reloading players')
        playerStatRepository.deleteAll()
        playerRepository.deleteAll()
        // Cache stats, teams, and positions so we don't hit the database so much
        List<Stat> stats = statRepository.findAll().asList()
        List<Position> positions = positionRepository.findAll().asList()
        List<NflTeam> nflTeams = nflTeamRepository.findAll().asList()

        URL playersUrl = buildUrl('players/draftClient', [positionCategories: POSITION_CATEGORIES])
        List<Player> players = getUrlJson(playersUrl)?.games?.'102016'?.players?.collect { id, Map player ->
            logger.debug("Processing player ${player?.name}")
            Player playerEntity = new Player(
                    id: id as Long,
                    name: player?.name,
                    injuryStatus: player?.injuryGameStatus,
                    averageDraftPosition: player?.researchStats?.season?.'2016'?.averageDraftPosition as BigDecimal,
                    projectedRank: player?.ranks?.season?.'2016'?.projectedRank as Integer,
                    draftRank: player?.ranks?.season?.'2016'?.draftRank as Integer,
                    nflTeam: nflTeams.find { it.id == player?.nflTeamId },
                    position: positions.find { it.abbr == player?.position }
            )


            player?.stats?.season?.forEach { String year, Map stat ->
                stat.forEach { String statId, String value ->
                    // Skip pts, we calculate that ourselves
                    if (statId == "pts") return

                    playerEntity.stats.add(new PlayerStat(
                            year: year as Integer,
                            stat: stats.find { it.id == statId as Long },
                            player: playerEntity,
                            value: value as BigDecimal
                    ))
                }
            }

            player?.projectedStats?.season?.forEach { String year, Map stat ->
                stat.forEach { String statId, String value ->
                    // Skip pts, we calculate that ourselves
                    if (statId == "pts") return

                    playerEntity.stats.add(new PlayerStat(
                            year: year as Integer,
                            stat: stats.find { it.id == statId as Long },
                            player: playerEntity,
                            value: value as BigDecimal
                    ))
                }
            }

            return playerEntity
        }

        playerRepository.save(players)
    }
}
