import { Controller, Get, Param, Post, Body, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Req() req: RequestWithUser, @Body() body: { messages: any[] }) {
    try {
      const userId = req.body.id;
      const result = await this.chatService.chat(body.messages, userId);
      return { result };
    } catch (err) {
      throw new HttpException(
        'Erro interno',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/history')
  async saveHistory(
    @Body() body: { userId: string; documentId: string; messages: any[] },
  ) {
    try {
      await this.chatService.saveHistory(body.documentId, body.messages);
      return { success: true };
    } catch (err) {
      console.error('Erro ao salvar histórico:', err);
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/history/:id')
  async getHistory(@Param('id') id: number) {
    try {
      const documentId = Number(id);
      const history = await this.chatService.getHistory(documentId);

      if (history == null) { return ({vazio: true}); }
      return history;
    } catch (err) {
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
