import { PrismaService } from "./prisma.service";
import { Module } from "@nestjs/common";
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- ESSENCIAL
})
export class PrismaModule {}