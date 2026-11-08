package com.schulmeister.garbagereporter.report.ai;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
public class ImageResizer {

    public static final String AI_IMAGE_FORMAT = "jpeg";
    public static final String UPLOADS_DIR = "/app/uploads/reports/";

    private ImageResizer() {
        /* This utility class should not be instantiated */
    }


    public static @NonNull Path createSmallTempImage(String image) {
        Path imagePath = getPath(image);

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
        return smallImage;
    }

    public static @NonNull Path getPath(String image) {
        return Path.of(
                UPLOADS_DIR,
                image
        );
    }

    public static @NonNull Path resolvePath(Path uploadDirectory, String image) {
        Path imagePath = uploadDirectory.resolve(image);

        if (!Files.isRegularFile(imagePath) || !Files.isReadable(imagePath)) {
            String error = "Image does not exist or is not readable: " + imagePath;
            log.error(error);
            throw new IllegalStateException(error);
        }
        return imagePath;
    }

    public static Path createAiImage(Path original) throws IOException {
        BufferedImage originalImage = getBufferedImage(original);
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        double scale = getScale(originalImage);

        if (scale < 1.0) {
            width = (int) Math.round(originalImage.getWidth() * scale);
            height = (int) Math.round(originalImage.getHeight() * scale);
        }

        BufferedImage resized = new BufferedImage(
                width,
                height,
                BufferedImage.TYPE_INT_RGB
        );

        Graphics2D graphics = resized.createGraphics();
        graphics.drawImage(originalImage, 0, 0, width, height, null);
        graphics.dispose();

        Path aiImage = Files.createTempFile("ai-", "." + AI_IMAGE_FORMAT);

        ImageIO.write(resized, AI_IMAGE_FORMAT, aiImage.toFile());
        log.info("Created AI image {}", aiImage);
        return aiImage;
    }

    public static @NonNull BufferedImage getBufferedImage(Path original) throws IOException {
        BufferedImage originalImage = ImageIO.read(original.toFile());

        if (originalImage == null) {
            throw new IOException("Could not read image: " + original);
        }
        return originalImage;
    }

    public static double getScale(BufferedImage originalImage) {
        int maxWidth = 1600;
        int maxHeight = 1600;

        return Math.min(
                (double) maxWidth / originalImage.getWidth(),
                (double) maxHeight / originalImage.getHeight()
        );
    }
}
