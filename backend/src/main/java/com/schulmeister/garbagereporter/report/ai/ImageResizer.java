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
    private ImageResizer() {
        /* This utility class should not be instantiated */
    }


    public static @NonNull Path createSmallTempImage(String image) {
        Path imagePath = getPath(image);

        Path smallImage;
        try {
            smallImage = resizeImage(imagePath, image);
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
        Path imagePath = Path.of(
                "/app/uploads/reports/",
                image
        );

        if (!Files.isRegularFile(imagePath) || !Files.isReadable(imagePath)) {
            String error = "Image does not exist or is not readable: " + imagePath;
            log.error(error);
            throw new IllegalStateException(error);
        }
        return imagePath;
    }

    public static String getExtension(String filename) {
        int index = filename.lastIndexOf('.');
        return index >= 0
                ? filename.substring(index + 1).toLowerCase()
                : "jpeg";
    }

    public static Path resizeImage(Path original, String imageName) throws IOException {
        BufferedImage originalImage = getBufferedImage(original);

        double scale = getScale(originalImage);

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

        ImageIO.write(resized, getExtension(imageName), aiImage.toFile());

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

    public static boolean imageNeedsResize(String image) {
        Path imagePath = getPath(image);

        try {
            BufferedImage originalImage = getBufferedImage(imagePath);
            double scale = getScale(originalImage);
            log.info("Image {} scale: {}", image, scale);
            return scale < 1.0;
        } catch (IOException e) {
            log.error("Failed to get scale of image: {}", e.getMessage());
            throw new IllegalStateException(
                    "Failed to get scale of image: " + e.getMessage(),
                    e
            );
        }
    }
}
