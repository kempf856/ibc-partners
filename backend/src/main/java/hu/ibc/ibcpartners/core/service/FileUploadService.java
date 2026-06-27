package hu.ibc.ibcpartners.core.service;

import hu.ibc.ibcpartners.core.dto.FileDownloadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
    String save(MultipartFile file);
    FileDownloadResponse download(String id);
}
