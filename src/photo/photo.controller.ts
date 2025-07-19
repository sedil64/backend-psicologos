// src/photo/photo.controller.ts
import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

import { PhotoService } from './photo.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('photos')
export class PhotoController {
  constructor(private readonly service: PhotoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('psicologo/me')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/fotos-psicologos';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `foto-${Date.now()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFotoMe(
    @UploadedFile() file: Express.Multer.File, // ✅ corrección aquí
    @Req() req: RequestWithUser,
  ) {
    return this.service.uploadFotoFromAuth(file.filename, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('psicologo/me')
  async getFotoMe(@Req() req: RequestWithUser) {
    const url = await this.service.getFotoFromAuth(req.user.id);
    return { url };
  }
}
