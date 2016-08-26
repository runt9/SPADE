package com.runt9.spade.model

final class LeaguePosition {
    public final static QB = 'QB'
    public final static RB = 'RB'
    public final static WR = 'WR'
    public final static TE = 'TE'
    public final static K = 'K'
    public final static BN = 'BN'
    public final static D_ST = 'D/ST'
    public final static RB_WR = 'RB/WR'
    public final static WR_TE = 'WR/TE'
    public final static allPositions = [QB, RB, WR, TE, K, BN, D_ST, RB_WR, WR_TE]

    String position

    LeaguePosition(String position) {
        this.position = position
    }

    @Override
    String toString() {
        position
    }
}
