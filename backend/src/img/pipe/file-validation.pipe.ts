import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedExtensions = ['image/jpeg', 'image/png'];

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const oneMB = 1000000;

    if (metadata.type === 'custom') {
      if (value.size > oneMB) {
        throw new BadRequestException(
          'Invalid size the image should be under 1MB'
        );
      }

      if (!this.allowedExtensions.includes(value.mimetype)) {
        throw new BadRequestException(
          `File type ${value.mimetype} is not allowed`
        );
      }
      return value;
    }
    throw new BadRequestException('Need to push the image to the body');
  }
}
