package com.runt9.spade.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

import javax.sql.DataSource

@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    DataSource dataSource

    @Override
    void configure(HttpSecurity http) {
        http
            .authorizeRequests()
                .antMatchers('/', '/login', '/logout').permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage('/login')
                .successForwardUrl('/')
                .permitAll()
                .and()
            .logout()
                .permitAll()
    }

    @Override
    void configure(AuthenticationManagerBuilder auth) {
        auth
            .jdbcAuthentication()
            .dataSource(dataSource)
            .usersByUsernameQuery('SELECT username, password, TRUE AS enabled FROM fantasy_owner WHERE username = ?')
            .passwordEncoder(new BCryptPasswordEncoder())
    }
}
