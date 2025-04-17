import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Req() req: RequestWithUser, @Body() body: { messages: any[] }) {
    try {
      const userId = req.user.sub;
      const result = await this.chatService.chat(body.messages, userId);
      return { result };
    } catch (err) {
      throw new HttpException(
        'Erro interno',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('save')
  async saveConversation(
    @Req() req: RequestWithUser,
    @Body() body: { documentId: string; messages: any[] },
  ) {
    const { documentId, messages } = body;

    if (!documentId || !messages) {
      throw new HttpException('Missing data', HttpStatus.BAD_REQUEST);
    }

    try {
      const history = await this.chatService.saveHistory(documentId, messages);
      return history;
    } catch (error) {
      throw new HttpException(
        'Failed to save history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
