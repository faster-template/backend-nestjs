import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PhoneAuthGuard extends AuthGuard('phone') {}
