package com.runt9.spade.repository

import com.runt9.spade.model.NflTeam
import org.springframework.data.repository.CrudRepository

interface NflTeamRepository extends CrudRepository<NflTeam, Long> {
}
