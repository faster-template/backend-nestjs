import { User } from '@/decorators/user.decorator';
import {
  UserModifyAvatar,
  UserModifyNickName,
  UserModifyPwdDto,
  UserModifyUserName,
} from './user.dto';
import { UserService } from './user.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CsrfGuard } from '@/guards/csrf.guard';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('info')
  @UseGuards(CsrfGuard)
  getInfo(@User('id') userId) {
    return this.userService.getInfo(userId);
  }

  @Post('modifyNickName')
  modifyNickName(@User('id') userId, @Body() data: UserModifyNickName) {
    return this.userService.modifyUserInfo(userId, data);
  }

  @Post('modifyUserName')
  modifyUserName(@User('id') userId, @Body() data: UserModifyUserName) {
    return this.userService.modifyUserName(userId, data.userName);
  }

  @Post('modifyAvatar')
  modifyAvatar(@User('id') userId, @Body() data: UserModifyAvatar) {
    return this.userService.modifyUserInfo(userId, data);
  }

  @Post('modifyPwd')
  modifyPwd(@User('id') userId, @Body() data: UserModifyPwdDto) {
    return this.userService.modifyPassword(
      userId,
      data.oldPassword,
      data.newPassword,
    );
  }

  // @Post('modifyPhone')
  // modifyPhone(@Request() req, @Body() modifyPhoneDto: UserModifyPhoneDto) {
  //   return this.userService.modifyPhone(req.user['id'], modifyPhoneDto);
  // }
}
