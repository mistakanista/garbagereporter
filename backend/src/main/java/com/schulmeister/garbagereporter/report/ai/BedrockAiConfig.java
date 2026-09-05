package com.schulmeister.garbagereporter.report.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.retry.RetryMode;
import software.amazon.awssdk.core.retry.RetryPolicy;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

import java.time.Duration;

@Configuration
public class BedrockAiConfig {

  @Bean
  public AwsCredentialsProvider awsCredentialsProvider() {
    return DefaultCredentialsProvider.create();
  }

  @Bean
  public Region bedrockRegion(
      @Value("${spring.ai.bedrock.aws.region:eu-central-1}") String region) {
    return Region.of(region);
  }

  /**
   * Shared synchronous Bedrock runtime client used by both the chat model (picked up by Spring AI's
   * Bedrock Converse autoconfiguration) and the embedding model. Configured with {@link
   * RetryMode#ADAPTIVE} so parallel per-module requirements generation degrades gracefully under
   * Bedrock throttling instead of failing fast.
   */
  @Bean
  @Primary
  public BedrockRuntimeClient bedrockRuntimeClient(
      AwsCredentialsProvider credentialsProvider,
      Region bedrockRegion,
      @Value("${spring.ai.bedrock.aws.timeout:5m}") String timeout,
      @Value("${spring.ai.bedrock.aws.connection-timeout:15s}") String connectionTimeout,
      @Value("${spring.ai.bedrock.aws.connection-acquisition-timeout:30s}")
          String connectionAcquisitionTimeout,
      @Value("${spring.ai.bedrock.aws.socket-timeout:180s}") String socketTimeout,
      @Value("${spring.ai.bedrock.aws.max-retries:5}") int maxRetries) {
    return BedrockRuntimeClient.builder()
        .credentialsProvider(credentialsProvider)
        .region(bedrockRegion)
        .httpClientBuilder(
            ApacheHttpClient.builder()
                .connectionTimeout(parseDuration(connectionTimeout))
                .connectionAcquisitionTimeout(parseDuration(connectionAcquisitionTimeout))
                .socketTimeout(parseDuration(socketTimeout)))
        .overrideConfiguration(
            config ->
                config
                    .apiCallTimeout(parseDuration(timeout))
                    .retryPolicy(
                        RetryPolicy.forRetryMode(RetryMode.ADAPTIVE).toBuilder()
                            .numRetries(maxRetries)
                            .build()))
        .build();
  }

  @Bean
  public ChatClient chatClient(ChatClient.Builder builder) {
    // No memory advisor for batch/stateless operations.
    return builder.build();
  }

  private Duration parseDuration(String value) {
    String trimmed = value.trim().toLowerCase();
    if (trimmed.endsWith("ms")) {
      return Duration.ofMillis(Long.parseLong(trimmed.substring(0, trimmed.length() - 2)));
    }
    if (trimmed.endsWith("s")) {
      return Duration.ofSeconds(Long.parseLong(trimmed.substring(0, trimmed.length() - 1)));
    }
    if (trimmed.endsWith("m")) {
      return Duration.ofMinutes(Long.parseLong(trimmed.substring(0, trimmed.length() - 1)));
    }
    if (trimmed.endsWith("h")) {
      return Duration.ofHours(Long.parseLong(trimmed.substring(0, trimmed.length() - 1)));
    }
    return Duration.parse(value);
  }
}
