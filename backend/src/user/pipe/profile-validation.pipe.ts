import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

export const updateProfileSchema = Joi.object({
  username: Joi.string().optional(),
  password: Joi.string().optional()
});

@Injectable()
export class ProfileValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const objectUnknown = value;

    if (metadata.type === 'body' && metadata.data === undefined) {
      const { error } = this.schema.validate(objectUnknown);

      if (error) {
        throw new HttpException(
          'Validation failed object need the right property',
          HttpStatus.BAD_REQUEST
        );
      }
      const { username, password } = value;

      if (username && !username.match(/^[a-z][^\W]{3,14}$/i)) {
        if (username.length > 15 || username.length < 4) {
          throw new HttpException(
            'Username length must be 4-15 characters',
            HttpStatus.BAD_REQUEST
          );
        }
        throw new HttpException(
          'Username start with [a-z], and contain only [a-zA-Z0-9]',
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        password &&
        !password.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&])(?=.{8,})[\w\W\d]{8,}/i
        )
      ) {
        if (password.length < 8) {
          throw new HttpException(
            'Password length must be 8 minimum',
            HttpStatus.BAD_REQUEST
          );
        }
        throw new HttpException(
          'Password should contain 1 [A-Z], 1 [a-z], 1 [0-9], 1 [!@#$%&]',
          HttpStatus.BAD_REQUEST
        );
      }

      return objectUnknown;
    }
    throw new HttpException('Need a body', HttpStatus.BAD_REQUEST);
  }
}
