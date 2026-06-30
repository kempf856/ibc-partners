package hu.ibc.ibcpartners.core.service;

import hu.ibc.ibcpartners.core.dto.FileDownloadResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class LocalStorageService implements FileUploadService {

    private final Path root = Paths.get("/uploads");

    public LocalStorageService() throws Exception {
        Files.createDirectories(root);
    }

    @Override
    public String save(MultipartFile file) {
        try {
            String original = file.getOriginalFilename();
            String ext = original.substring(original.lastIndexOf("."));

            String id = UUID.randomUUID() + ext;
            Path target = root.resolve(id);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return id;
        } catch (Exception e) {
            log.error("File upload error", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Fájl feltöltés hiba!");
        }
    }

    @Override
    public FileDownloadResponse download(String id) {
        try {
            Path file = root.resolve(id);
            String contentType = Files.probeContentType(file);
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fájl nem található!");
            }
            return new FileDownloadResponse(resource, contentType);
        } catch (Exception e) {
            log.error("File download error", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Fájl letöltés hiba!");
        }
    }
}
