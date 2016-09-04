package com.runt9.spade.dto

class DraftPlayerQueryDTO {
    Integer pageSize
    Integer page
    String sortProperty
    Boolean ascending

    // Filter props
    String nameSearch
    Long positionId
    Long nflTeamId
    Boolean available
    Boolean tagged
    Boolean showFreeAgents
}
