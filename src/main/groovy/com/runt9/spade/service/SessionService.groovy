package com.runt9.spade.service

import javax.servlet.http.HttpServletRequest

class SessionService {
    private final static TAGGED_PLAYERS = 'TAGGED_PLAYERS'

    private static String getDraftTaggedPlayersKey(Long draftId) {
        return TAGGED_PLAYERS + '_' + draftId
    }

    static List<Long> getTaggedPlayers(Long draftId, HttpServletRequest request) {
        request.getSession().getAttribute(getDraftTaggedPlayersKey(draftId)) as List
    }

    static void setTaggedPlayers(Long draftId, List<Long> players, HttpServletRequest request) {
        request.getSession().setAttribute(getDraftTaggedPlayersKey(draftId), players)
    }

    static List<Long> tagPlayer(Long draftId, Long playerId, HttpServletRequest request) {
        List<Long> players = getTaggedPlayers(draftId, request)
        if (players == null) {
            players = []
        }

        players.add(playerId)
        setTaggedPlayers(draftId, players, request)
        return players
    }

    static List<Long> untagPlayer(Long draftId, Long playerId, HttpServletRequest request) {
        List<Long> players = getTaggedPlayers(draftId, request)
        if (players == null) {
            return
        }

        players.remove(playerId)
        setTaggedPlayers(draftId, players, request)
        return players
    }
}
