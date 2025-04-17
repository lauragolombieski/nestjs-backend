import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { DocumentModule } from './document/document.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    DocumentModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
