package com.runt9.spade.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class IndexController {
    @RequestMapping("/")
    def @ResponseBody index() {
        return "Hello World!"
    }
}