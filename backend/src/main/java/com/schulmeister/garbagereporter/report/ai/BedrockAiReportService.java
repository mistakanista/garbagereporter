package com.schulmeister.garbagereporter.report.ai;

import com.schulmeister.garbagereporter.report.Report;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.content.Media;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
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

        Path imagePath = Path.of(
                "/app/uploads/reports/",
                report.getImage()
        );

        if (!Files.isRegularFile(imagePath) || !Files.isReadable(imagePath)) {
            String error = "Image does not exist or is not readable: " + imagePath;
            log.error(error);
            throw new IllegalStateException(
                    error
            );
        }

        String prompt = """
                The image is to be used to verify whether a citizen's report is plausible.
            
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


        Path smallImage;
        try {
            smallImage = createAiImage(imagePath);
        } catch (IOException e) {
            log.error("Failed to create AI image: {}", e.getMessage());
            throw new IllegalStateException(
                    "Failed to create AI image: " + e.getMessage(),
                    e
            );
        }


        Path aiImage = smallImage;
        return chatClient
                .prompt()
                .user(user -> user
                        .text(prompt)
                        .media(
                                new Media(
                                        MimeType.valueOf(
                                                "image/" + getExtension(report.getImage())
                                        ),
                                        new FileSystemResource(aiImage)
                                )
                        )
                )
                .call()
                .entity(AiReportResult.class);


    }

    private String getExtension(String filename) {
        int index = filename.lastIndexOf('.');
        return index >= 0
                ? filename.substring(index + 1).toLowerCase()
                : "jpeg";
    }

    private Path createAiImage(Path original) throws IOException {
        BufferedImage originalImage = ImageIO.read(original.toFile());

        if (originalImage == null) {
            throw new IOException("Could not read image: " + original);
        }

        int maxWidth = 1600;
        int maxHeight = 1600;

        double scale = Math.min(
                (double) maxWidth / originalImage.getWidth(),
                (double) maxHeight / originalImage.getHeight()
        );

        // Bereits klein genug
        if (scale >= 1.0) {
            return original;
        }

        int width = (int) Math.round(originalImage.getWidth() * scale);
        int height = (int) Math.round(originalImage.getHeight() * scale);

        BufferedImage resized = new BufferedImage(
                width,
                height,
                BufferedImage.TYPE_INT_RGB
        );

        Graphics2D graphics = resized.createGraphics();
        graphics.drawImage(originalImage, 0, 0, width, height, null);
        graphics.dispose();

        Path aiImage = Files.createTempFile("ai-", ".jpeg");

        ImageIO.write(resized, "jpeg", aiImage.toFile());

        return aiImage;
    }
}
