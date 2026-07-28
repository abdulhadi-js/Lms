import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  originalFilename: string;
}

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder = 'assignments',
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto', // handles PDF, images, videos, etc.
          use_filename: true,
          unique_filename: true,
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            originalFilename: result.original_filename,
          });
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadProfilePicture(file: Express.Multer.File): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, 'profiles');
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
