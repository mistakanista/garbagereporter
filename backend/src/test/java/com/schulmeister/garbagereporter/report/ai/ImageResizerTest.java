package com.schulmeister.garbagereporter.report.ai;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import javax.imageio.ImageIO;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

import java.io.IOException;

class ImageResizerTest {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("resolvePath: existing readable image returns path")
    void resolvePath_existingImage_returnsPath() throws IOException {

        String image = "test.jpg";
        Path imagePath = tempDir.resolve(image);
        Files.createFile(imagePath);

        Path result = ImageResizer.resolvePath(tempDir, image);

        assertThat(result).isEqualTo(imagePath);
    }

    @Test
    @DisplayName("getPath: non-existing image throws exception")
    void getPath_nonExistingImage_throwsException() {

        assertThatThrownBy(() -> ImageResizer.resolvePath(tempDir, "missing.jpg"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Image does not exist or is not readable");
    }

    @Test
    @DisplayName("getPath: directory instead of image throws exception")
    void getPath_directory_throwsException() throws IOException {

        Files.createDirectory(tempDir.resolve("directory"));

        assertThatThrownBy(() -> ImageResizer.resolvePath(tempDir, "directory"))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("createAiImage: creates a resized image")
    void createSmallerAiImage() throws IOException {

        Path testImage = createTestImage(tempDir, 2000);

        Path result = ImageResizer.createAiImage(testImage);

        assertThat(result).isNotNull();
        File file = result.toFile();
        assertTrue(file.exists());
        assertTrue(file.getName().endsWith(".jpeg"));
        assertTrue(file.getName().contains("ai"));

        BufferedImage originalImage = ImageResizer.getBufferedImage(result);
        assertThat(originalImage.getWidth()).isEqualTo(1600);
        assertThat(originalImage.getHeight()).isEqualTo(1600);

        double scale = ImageResizer.getScale(originalImage);
        assertThat(scale).isEqualTo(1.0);
    }

    @Test
    @DisplayName("createAiImage: creates a resized image")
    void createAiImageSameSize() throws IOException {

        Path testImage = createTestImage(tempDir, 50);

        Path result = ImageResizer.createAiImage(testImage);

        assertThat(result).isNotNull();
        File file = result.toFile();
        assertTrue(file.exists());
        assertTrue(file.getName().endsWith(".jpeg"));
        assertTrue(file.getName().contains("ai"));

        BufferedImage originalImage = ImageResizer.getBufferedImage(result);
        assertThat(originalImage.getWidth()).isEqualTo(50);
        assertThat(originalImage.getHeight()).isEqualTo(50);
    }

    private Path createTestImage(Path directory, int size) throws IOException {
        Path imagePath = directory.resolve("test.png");

        BufferedImage image = new BufferedImage(
                size,
                size,
                BufferedImage.TYPE_INT_RGB
        );

        ImageIO.write(image, "png", imagePath.toFile());

        return imagePath;
    }


}
