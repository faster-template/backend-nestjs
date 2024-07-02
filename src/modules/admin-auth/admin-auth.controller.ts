import { LocalAuthGuard } from '@/guards/passport-guards/local.guard';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AuthNotRequire } from '../user-auth/user-auth.decorator';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private authAdminService: AdminAuthService) {}

  @AuthNotRequire()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: any) {
    return this.authAdminService.generateToken(req.user);
  }
}
