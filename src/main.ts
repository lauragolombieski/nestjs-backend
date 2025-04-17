import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'module-alias/register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(3001);
  console.log('Rodando em http://localhost:3001');
}

bootstrap();
