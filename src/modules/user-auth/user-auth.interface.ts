import { EUserRole } from '@/modules/user-role/user-role.enum';

export interface IPayload {
  id: string;
  roles: EUserRole[];
}

export interface ITokenResult {
  access_token: string;
}
