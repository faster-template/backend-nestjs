import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { BaseDefaultRepository } from '@/core/repository/base.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, BaseDefaultRepository])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
