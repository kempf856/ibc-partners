package hu.ibc.ibcpartners.core.controller;

import hu.ibc.ibcpartners.core.dto.FileDownloadResponse;
import hu.ibc.ibcpartners.core.dto.FileUploadResponse;
import hu.ibc.ibcpartners.core.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping
    public ResponseEntity<FileUploadResponse> upload(@RequestParam MultipartFile upload) {
        if (upload.getSize() > 1_000_000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A kép maximális mérete 1 MB lehet!");
        }

        String id = fileUploadService.save(upload);
        return ResponseEntity.ok(new FileUploadResponse("/api/files/" + id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> download(@PathVariable String id) {
        FileDownloadResponse response = fileUploadService.download(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(response.contentType() == null ? "application/octet-stream" : response.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(response.resource());
    }
}
