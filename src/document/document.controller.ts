import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  Get,
  UploadedFile,
  UseInterceptors,
  Delete,
  BadRequestException,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService, private readonly prisma: PrismaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    const userId = req.body.id;
    const fileName = req.body.fileName

    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
      throw new BadRequestException('ID de usuário inválido.');
    }

    return this.documentService.processDocument(file, numericUserId, fileName);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: number, @Res() res: Response) {
    const document = await this.prisma.document.findUnique({
      where: { id: Number(id) },
      select: { image: true },
    });

    if (!document || !document.image) {
      throw new NotFoundException('Imagem não encontrada');
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(document.image);
  }

  @Get(':id')
  async getUserDocuments(@Param('id') id: string) {
    const userId = Number(id);
  
    if (!userId) {
      throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
    }
  
    try {
      const documentos = await this.documentService.getDocumentsByUser(userId);
      return documentos;
    } catch (error) {
      console.error(error);
      throw new HttpException('Erro ao buscar histórico', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete()
  async deleteDocument(
    @Body() body: { selectedDocuments: string[] },
    @Request() req: any,
  ) {
    const userId = req.body?.id;

    if (!userId) {
      throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
    }

    if (!Array.isArray(body.selectedDocuments) || body.selectedDocuments.length === 0) {
      throw new HttpException('Nenhum documento selecionado', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.documentService.deleteUserDocuments(body.selectedDocuments);
      return { message: 'Documentos deletados com sucesso' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Erro ao excluir documentos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
