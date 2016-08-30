package com.runt9.spade.service

import com.runt9.spade.model.draft.Draft
import com.runt9.spade.model.draft.DraftPlayer
import com.runt9.spade.model.draft.DraftPlayerPointTotal
import com.runt9.spade.model.draft.ScoringSetting
import com.runt9.spade.model.player.PlayerStat
import com.runt9.spade.repository.DraftRepository
import com.runt9.spade.repository.PlayerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PlayerStatsService {
    public static final SCORING_TYPE_POINTS = 'points';
    public static final SCORING_TYPE_YARDS_PER_POINT = 'yards_per_point';

    @Autowired
    PlayerRepository playerRepository

    @Autowired
    DraftRepository draftRepository

    private static BigDecimal calculatePlayerStatPoints(PlayerStat playerStat, ScoringSetting scoringSetting) {
        if (scoringSetting == null || scoringSetting.valuePerStat == null) {
            return 0.0
        }

        if (playerStat.stat.scoringType == SCORING_TYPE_POINTS) {
            return scoringSetting.valuePerStat * playerStat.value
        } else if (playerStat.stat.scoringType == SCORING_TYPE_YARDS_PER_POINT) {
            return (1 / scoringSetting.valuePerStat) * playerStat.value
        }

        return 0.0
    }

    Draft recalculatePlayerPoints(Draft draft) {
        playerRepository.findAll().forEach { player ->
            DraftPlayer draftPlayer = new DraftPlayer(draft: draft, player: player)
            def playerStatTotals = [:]

            player.stats.forEach { playerStat ->
                if (!playerStatTotals.containsKey(playerStat.year)) {
                    playerStatTotals[playerStat.year] = 0.0
                }

                def playerStatPointValue = playerStatTotals.get(playerStat.year)
                playerStatPointValue += calculatePlayerStatPoints(playerStat, draft.scoringSettings.find { it.stat.id == playerStat.stat.id })
                playerStatTotals[playerStat.year] = playerStatPointValue
            }

            playerStatTotals.forEach { Integer year, BigDecimal points ->
                draftPlayer.playerPointTotals.add(new DraftPlayerPointTotal(year: year, value: points, player: player, draft: draft))
            }

            draft.draftPlayers.add(draftPlayer)
        }

        draftRepository.save(draft)
    }
}
