import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private prisma: PrismaClient;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.prisma = new PrismaClient();
  }

  async chat(messages: any[], userId: string) {
    try {
      const validMessages = messages.filter(msg => msg && msg.role && msg.content);
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: validMessages,
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error('Erro na API do Chat:', err);
      throw new Error('Erro ao gerar resposta');
    }
  }

  async saveHistory(documentId: string, messages: any[]) {
    return this.prisma.history.create({
      data: {
        documentId: Number(documentId),
        messages: JSON.stringify(messages),
      },
    });
  }

  async getHistory(documentId: number) {
    return this.prisma.history.findFirst({
      where: { documentId: documentId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
