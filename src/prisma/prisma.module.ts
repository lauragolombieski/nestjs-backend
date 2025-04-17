import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

//constructor(private prisma: PrismaService) {}

//async getUser(id: string) {
//  return this.prisma.user.findUnique({ where: { id } });
//}