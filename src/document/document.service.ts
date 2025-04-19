import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { writeFile, unlink } from 'fs/promises';
import * as FormData from 'form-data';
import axios from 'axios';
import * as path from 'path';

@Injectable()
export class DocumentService {
  private readonly apiKey = 'K81610654988957';

  constructor(private readonly prisma: PrismaService) {}

  async getDocumentsByUser(userId: number) {
    return this.prisma.document.findMany({
      where: { userId },
    });
  }

  async processDocument(file: Express.Multer.File, userId: number, fileName: string) {
    try {

      const formData = new FormData();
      formData.append('apikey', this.apiKey);
      formData.append('language', 'por');
      formData.append('file', file.buffer, fileName);

      const response = await axios.post('https://api.ocr.space/parse/image', formData, {
        headers: formData.getHeaders(),
      });
  
      const text = response.data.ParsedResults?.[0]?.ParsedText || 'Sem texto definido';
  
      await this.prisma.document.create({
        data: {
          userId,
          content: text,
          title: file.originalname,
          image: file.buffer,
          publicUrl: 'teste'
        },
      });
      return { success: true, text };
    } catch (err) {
      console.error('Erro no processamento:', err);
      throw new InternalServerErrorException('Erro ao processar o documento.');
    }
  }

  async deleteUserDocuments(documentIds: string[]): Promise<void> {
    const numericDocumentIds = documentIds.map(id => Number(id));

    await this.prisma.document.deleteMany({
      where: {
        id: { in: numericDocumentIds },
      },
    });
  }
}
