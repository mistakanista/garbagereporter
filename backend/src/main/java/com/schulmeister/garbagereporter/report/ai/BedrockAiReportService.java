package com.schulmeister.garbagereporter.report.ai;

import com.schulmeister.garbagereporter.report.Report;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.content.Media;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;

import java.awt.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@Profile("bedrock")
@Slf4j
public class BedrockAiReportService implements AiReportService {

    private final ChatClient chatClient;

    public BedrockAiReportService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @Override
    public AiReportResult analyze(Report report) {
        log.info("Profile: Bedrock");

        Path smallImage = ImageResizer.createSmallTempImage(report.getImage());

        String prompt = """
                The image is to be used to verify whether a citizen's trash bin report is plausible.
            
                    Reason for report:
                    %s
            
                    Check:
            
                    - Is a public trash can visible?
                    - Is the reported issue visible in the photo?
                    - How certain is the assessment?
            
                    Rules:
            
                    - If no trash can is visible: trashBinDetected=false.
                    - If the reported issue is not clearly identifiable: reasonMatches=false.
                    - Do not force a positive rating if image quality is poor.
                    - confidence is a number between 0 and 1.
                    - Evaluate based solely on visible information.
            """.formatted(report.getType());

        try {
            return chatClient
                .prompt()
                .user(user -> user
                    .text(prompt)
                    .media(
                        new Media(
                            MimeType.valueOf(
                                    "image/" + ImageResizer.AI_IMAGE_FORMAT
                            ),
                            new FileSystemResource(smallImage)
                        )
                    )
                )
                .call()
                .entity(AiReportResult.class);

        } catch (Exception e) {
            log.error("Error when analyzing image {} by AI: {}", report.getImage(), e.getMessage());
        } finally {
            try {
                Files.deleteIfExists(smallImage);
            } catch (IOException e) {
                log.warn("Failed to delete temporary AI image: {}", e.getMessage());
            }
        }
        return null;
    }
}
