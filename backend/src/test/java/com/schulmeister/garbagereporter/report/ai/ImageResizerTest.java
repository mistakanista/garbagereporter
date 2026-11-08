package com.schulmeister.garbagereporter.report.ai;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import static com.schulmeister.garbagereporter.report.ai.ImageResizer.UPLOADS_DIR;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.file.Files;
import java.nio.file.Path;

import java.io.IOException;

class ImageResizerTest {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("getStaticPath: gets the static path")
    void getStaticPath() {
        Path path = ImageResizer.getPath("test.jpg");

        assertThat(path).isEqualTo(Path.of(UPLOADS_DIR + "/test.jpg"));
    }

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

}
