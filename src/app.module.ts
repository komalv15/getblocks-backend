import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [AuthModule, AdminModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
