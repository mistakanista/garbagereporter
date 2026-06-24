package com.schulmeister.barcamp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                .csrf(AbstractHttpConfigurer::disable) // für REST ok
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/sponsors/list").permitAll()
                        .requestMatchers("/api/sponsors/**").authenticated()
                        .anyRequest().permitAll()
                )
                .httpBasic(withDefaults());

        return http.build();
    }

    @Bean
    public UserDetailsService users() {

        String basicAuthPw = System.getenv("BASIC_AUTH_PW");
        UserDetails user = User
                .withUsername("admin")
                .password(passwordEncoder().encode(basicAuthPw))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
