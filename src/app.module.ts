import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [UsersModule, NatsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
