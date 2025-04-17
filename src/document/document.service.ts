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
    console.log('aqui')
    return this.prisma.document.findMany({
      where: { userId },
    });
  }

  async processDocument(file: Express.Multer.File, userId: number, fileName: string) {
    try {

      const publicUrl = `/images/${fileName}`;

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
          publicUrl,
          content: text,
          title: file.originalname,
        },
      });

      return { success: true, text };
    } catch (err) {
      console.error('Erro no processamento:', err);
      throw new InternalServerErrorException('Erro ao processar o documento.');
    }
  }

  async deleteUserDocuments(documentIds: string[], userId: number): Promise<void> {
    const numericDocumentIds = documentIds.map(id => Number(id));
  
    const docsToDelete = await this.prisma.document.findMany({
      where: {
        id: { in: numericDocumentIds },
        userId,
      },
    });
  
    for (const doc of docsToDelete) {
      if (doc.publicUrl) {
        const filePath = path.resolve('public', doc.publicUrl);
        try {
          await unlink(filePath);
        } catch (err) {
          console.warn(`Não foi possível excluir o arquivo ${filePath}`, err);
        }
      }
    }
  
    await this.prisma.document.deleteMany({
      where: {
        id: { in: numericDocumentIds },
        userId,
      },
    });
  }
}
