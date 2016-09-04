package com.runt9.spade.repository

import com.runt9.spade.model.common.NflTeam
import org.springframework.data.repository.CrudRepository

interface NflTeamRepository extends CrudRepository<NflTeam, Long> {
}
