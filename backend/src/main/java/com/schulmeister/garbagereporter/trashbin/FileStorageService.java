package com.schulmeister.garbagereporter.trashbin;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Slf4j
public class FileStorageService {

    private final Path uploadPath = Paths.get("uploads/sponsors");

    public String store(MultipartFile file) {

        try {

            Files.createDirectories(uploadPath);

            String filename = file.getOriginalFilename();

            assert filename != null;
            Path target = uploadPath.resolve(filename);

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return filename;

        } catch (IOException e) {
            log.error("File upload failed", e);
        }
        return "";
    }
}
