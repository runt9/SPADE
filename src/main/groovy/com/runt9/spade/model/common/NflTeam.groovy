package com.runt9.spade.model.common

import javax.persistence.Entity
import javax.persistence.Id

@Entity
class NflTeam {
    @Id
    Long id
    String nickName
    String city
    String abbr
    Integer byeWeek
}
