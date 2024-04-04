import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModelsModule } from './mongodb/mongodb-models.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from './middlewares/jwt/jwt.module';
import { JwtMiddleware } from './middlewares/jwt/jwt.middleware';
import { JWT_CONFIG } from './config/envs/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [JWT_CONFIG] }),
    DatabaseModule,
    MongooseModelsModule,
    AuthModule,
    AdminModule,
    UserModule,
    JwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({ path: 'auth/signup', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
