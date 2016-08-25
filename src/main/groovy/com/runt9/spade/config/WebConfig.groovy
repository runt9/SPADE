package com.runt9.spade.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter

@Configuration
class WebConfig extends WebMvcConfigurerAdapter {
    @Override
    void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController('/').setViewName('index')
        registry.addViewController('/draft/{draftId}').setViewName('draft')
        registry.addViewController('/draft/{draftId}/draftBoard').setViewName('draftBoard')
        registry.addViewController('/modals/newDraftModal').setViewName('modals/newDraftModal')
    }
}