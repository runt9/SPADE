package com.runt9.spade.model

import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document

@Document(indexName = "draft")
class Draft {
    @Id
    String id
    String name
    String leagueName
    List<String> fantasyTeams
}
