import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModelsModule } from './mongodb/mongodb-models.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MongooseModelsModule,
    AuthModule,
    AdminModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
