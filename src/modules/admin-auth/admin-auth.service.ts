import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/modules/user/user.entity';

import { UserAuthService } from '../user-auth/user-auth.service';
import { ITokenResult } from '../user-auth/user-auth.interface';
@Injectable()
export class AdminAuthService {
  constructor(private userAuthService: UserAuthService) {}

  async generateToken(user: UserEntity): Promise<ITokenResult> {
    return await this.userAuthService.generateToken(user, true);
  }
}
