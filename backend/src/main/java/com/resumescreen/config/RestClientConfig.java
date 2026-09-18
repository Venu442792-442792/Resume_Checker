package com.resumescreen.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

/**
 * Configures the HTTP client used to call the Python/FastAPI NLP service.
 *
 * NOTE: the project plan originally named this "WebClientConfig", but this
 * codebase uses Spring 6.1's synchronous {@link RestClient} instead of the
 * reactive WebClient — it needs no extra reactor/netty dependencies, fits a
 * plain Spring MVC (servlet) app naturally, and is the currently recommended
 * modern replacement for RestTemplate for exactly this kind of blocking,
 * service-to-service call.
 */
@Configuration
public class RestClientConfig {

    @Value("${app.nlp.base-url}")
    private String nlpBaseUrl;

    @Value("${app.nlp.timeout-seconds}")
    private int timeoutSeconds;

    @Bean
    public RestClient nlpRestClient() {
        ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(Duration.ofSeconds(timeoutSeconds))
                .withReadTimeout(Duration.ofSeconds(timeoutSeconds));

        ClientHttpRequestFactory requestFactory = ClientHttpRequestFactories.get(settings);

        return RestClient.builder()
                .baseUrl(nlpBaseUrl)
                .requestFactory(requestFactory)
                .build();
    }
}
