import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PhotoService } from './photo.service';
import { Express } from 'express';

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload/:psicologoId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/fotos-psicologos',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `foto-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFoto(
    @Param('psicologoId') psicologoId: number,
    @UploadedFile() file,
  ) {
    return this.photoService.saveFoto(file.filename, psicologoId);
  }
}
