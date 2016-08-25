package com.runt9.spade.model

enum NFLTeam {
    ARI("Arizona Cardinals", "ARI"),
    ATL("Atlanta Falcons", "ATL"),
    BAL("Baltimore Ravens", "BAL"),
    BUF("Buffalo Bills", "BUF"),
    CAR("Carolina Panthers", "CAR"),
    CHI("Chicago Bears", "CHI"),
    CIN("Cincinnati Bengals", "CIN"),
    CLE("Cleveland Browns", "CLE"),
    DAL("Dallas Cowboys", "DAL"),
    DEN("Denver Broncos", "DEN"),
    DET("Detroit Lions", "DET"),
    GB("Green Bay Packers", "GB"),
    HOU("Houston Texans", "HOU"),
    IND("Indianapolis Colts", "IND"),
    JAX("Jacksonville Jaguars", "JAX"),
    KC("Kansas City Chiefs", "KC"),
    MIA("Miami Dolphins", "MIA"),
    MIN("Minnesota Vikings", "MIN"),
    NE("New England Patriots", "NE"),
    NO("New Orleans Saints", "NO"),
    NYJ("New York Jets", "NYJ"),
    OAK("Oakland Raiders", "OAK"),
    PHI("Philadelphia Eagles", "PHI"),
    PIT("Pittsburgh Steelers", "PIT"),
    SD("San Diego Chargers", "SD"),
    SEA("Seattle Seahawks", "SEA"),
    SF("San Francisco 49ers", "SF"),
    TB("Tampa Bay Buccaneers", "TB"),
    TEN("Tennessee Titans", "TEN"),
    WAS("Washington Redskins", "WAS");

    String name
    String shortName

    NFLTeam(name, shortName) {
        this.name = name
        this.shortName = shortName
    }
}
