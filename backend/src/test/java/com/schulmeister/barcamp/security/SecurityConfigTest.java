package com.schulmeister.barcamp.security;

import com.schulmeister.barcamp.sponsors.FileStorageService;
import com.schulmeister.barcamp.sponsors.SponsorController;
import com.schulmeister.barcamp.sponsors.SponsorService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SponsorController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SponsorService sponsorService;

    @MockitoBean
    private FileStorageService fileStorageService;

    @Test
    void shouldAllowPublicAccess() throws Exception {
        when(sponsorService.findByLevel("gold"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/sponsors/list")
                        .param("level", "gold"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldDenyAccessWithoutAuth() throws Exception {
        mockMvc.perform(post("/api/sponsors")
                        .contentType("application/json")
                        .content(getContent()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldDenyAccessWithWrongAuth() throws Exception {
        mockMvc.perform(post("/api/sponsors")
                        .with(httpBasic("admin", "test"))
                        .contentType("application/json")
                        .content(getContent()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowAccessWithCorrectAuth() throws Exception {

        String basicAuthPw = System.getenv("BASIC_AUTH_PW");
        mockMvc.perform(post("/api/sponsors")
                        .with(httpBasic("admin", basicAuthPw))
                        .contentType("application/json")
                        .content(getContent()))
                .andExpect(status().isUnauthorized());
    }

    private @NonNull String getContent() {
        return """
                    {
                      "name": "Test",
                      "level": "gold",
                      "logo": "test.png"
                    }
                """;
    }


}
