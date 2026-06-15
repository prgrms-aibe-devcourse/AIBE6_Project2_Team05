package com.wedge.backend.global.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class R2FileUploadService {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.s3.endpoint}")
    private String endpoint;

    public String upload(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String fileName = folder + "/" + UUID.randomUUID() + ext;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(fileName)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // Presigned URL 생성 (7일 유효)
        S3Presigner presigner = S3Presigner.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(
                        software.amazon.awssdk.auth.credentials.StaticCredentialsProvider.create(
                                software.amazon.awssdk.auth.credentials.AwsBasicCredentials.create(accessKey, secretKey)))
                .region(software.amazon.awssdk.regions.Region.of("auto"))
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofDays(365))
                .getObjectRequest(GetObjectRequest.builder()
                        .bucket(bucket)
                        .key(fileName)
                        .build())
                .build();

        return presigner.presignGetObject(presignRequest).url().toString();
    }

    public void delete(String fileUrl) {
        // presigned URL에서 key 추출 불가 → fileName 직접 받도록 나중에 리팩토링 필요
        // 임시로 skip
    }
}