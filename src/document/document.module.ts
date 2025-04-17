import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentController],
  providers: [DocumentService, PrismaService, ChatService],
})
export class DocumentModule {}
