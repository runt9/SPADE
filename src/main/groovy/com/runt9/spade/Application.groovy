package com.runt9.spade

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan

@EnableAutoConfiguration
@SpringBootApplication
@ComponentScan(['com.runt9.spade', 'asset.pipeline.springboot'])
class Application {
    static void main(String[] args) {
        SpringApplication.run(Application, args)
    }
}
