package com.runt9.spade

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication

@EnableAutoConfiguration
@SpringBootApplication
class Application {
    static void main(String[] args) {
        SpringApplication.run(Application, args)
    }
}
