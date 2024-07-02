import { Module } from '@nestjs/common';
import { DraftService } from './draft.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftEntity } from './draft.entity';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { DraftController } from './draft.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([DraftEntity, BaseDefaultRepository]),
  ],
  providers: [DraftService],
  exports: [DraftService],
  controllers: [DraftController],
})
export class DraftModule {}
