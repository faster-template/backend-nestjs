import { genrateRandomStr } from '@/utils';
import { CryptoUtil } from '@/utils/crypto.util';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { UserEntity } from '@/modules/user/user.entity';
import { UserRoleEntity } from '@/modules/user-role/user-role.entity';
import { EUserRole } from '@/modules/user-role/user-role.enum';

export default {
  install: async function (app) {
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const adminRepository = queryRunner.manager.getRepository(UserEntity);
      const adminCount = await adminRepository.count();

      if (adminCount == 0) {
        const defaultAdmin = new UserEntity();
        // 随机用户名
        const randomUserName = 'admin' + genrateRandomStr(2);
        defaultAdmin.userName = randomUserName;
        // 创建一个随机的8位密码
        const randomPsw = genrateRandomStr(8);
        const encryptedData = CryptoUtil.encrypt(randomPsw);
        defaultAdmin.password = encryptedData.encrypted;
        defaultAdmin.passwordSalt = encryptedData.iv;
        defaultAdmin.nickName = '超级管理员';

        const da = await queryRunner.manager.save(defaultAdmin);

        const adminRole = new UserRoleEntity();
        adminRole.userId = da.id;
        adminRole.roleType = EUserRole.SuperAdmin;
        // adminRole.creatorId = da.id;
        await queryRunner.manager.save(adminRole);
        // 尝试删除 _init.txt 文件

        const filePath = path.join(process.cwd(), '_init.txt');
        if (fs.existsSync(filePath)) {
          fs.rmSync(filePath, { force: true });
        }
        const content =
          `默认管理员账户：\n userName: ${randomUserName}\n` +
          `password: ${randomPsw}\n`;

        fs.writeFileSync(filePath, content, 'utf8');

        await queryRunner.commitTransaction();

        // 在上层目录新建一个文件
        console.log(
          '\x1B[32m%s\x1B[0m',
          '-------------------------------------------------',
        );
        console.log(
          '\x1B[32m%s\x1B[0m',
          `检测到你的数据库中没有默认管理员，已自动创建`,
        );
        console.log('\x1B[32m%s\x1B[0m', `用户名：${randomUserName}`);
        console.log('\x1B[32m%s\x1B[0m', `密码：${randomPsw}`);
        console.log(
          '\x1B[32m%s\x1B[0m',
          `你可前往项目根目录下 _init.txt 中查看`,
        );
        console.log(
          '\x1B[32m%s\x1B[0m',
          '-------------------------------------------------',
        );
      }
    } catch (err) {
      // 由于发生错误，让我们回滚所做的更改
      console.log('init-db ERROR:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // 您需要释放手动创建的查询运行器：
      await queryRunner.release();
    }
  },
};
