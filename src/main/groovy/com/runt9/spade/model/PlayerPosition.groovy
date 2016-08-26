package com.runt9.spade.model

enum PlayerPosition {
    QB,
    RB,
    WR,
    TE,
    K,

    DST {
        @Override
        String toString() {
            return 'D/ST'
        }
    }
}