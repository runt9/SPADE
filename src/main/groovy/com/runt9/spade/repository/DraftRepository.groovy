package com.runt9.spade.repository

import com.runt9.spade.model.Draft
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository

interface DraftRepository extends ElasticsearchRepository<Draft, String> {
}
