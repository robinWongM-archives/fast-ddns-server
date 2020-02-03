import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifyGateway } from './notify.gateway';
import { Record } from './record.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: resolve(__dirname, '../data/ddns.db'),
      entities: [Record],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Record]),
  ],
  controllers: [AppController],
  providers: [AppService, NotifyGateway],
})
export class AppModule {}
