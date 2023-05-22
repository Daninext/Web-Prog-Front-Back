import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.data) throw new BadRequestException('Bad image data');

    const type = value.data.split(';')[0];
    if (!type.match(/(jpg|jpeg|png)$/))
      throw new BadRequestException('Bad image data');

    return value;
  }
}
