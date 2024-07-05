import { AutoMapper } from '@/core/auto-mapper';
import { ArticleViewDto } from '@/modules/article/article.dto';
import { ArticleEntity } from '@/modules/article/article.entity';
import { CategoryViewDto } from '@/modules/category/category.dto';
import { CategoryEntity } from '@/modules/category/category.entity';
import { DraftViewDto } from '@/modules/draft/draft.dto';
import { DraftEntity } from '@/modules/draft/draft.entity';
import { MaterialViewDto } from '@/modules/material/material.dto';
import { MaterialEntity } from '@/modules/material/material.entity';

export default {
  install: function () {
    AutoMapper.addMapper(ArticleEntity, ArticleViewDto);
    AutoMapper.addMapper(DraftEntity, DraftViewDto);
    AutoMapper.addMapper(MaterialEntity, MaterialViewDto);
    AutoMapper.addMapper(CategoryEntity, CategoryViewDto);
  },
};
