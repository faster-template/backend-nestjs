import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { UserAuthModule } from '../user-auth/user-auth.module';

@Module({
  imports: [UserAuthModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
