import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AtAuthGuard } from './utils/guards';
import { RolesGuard } from './utils/guards/roles.guard';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(
      `mongodb://test:test@localhost/auth?authSource=admin`,
    ),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
