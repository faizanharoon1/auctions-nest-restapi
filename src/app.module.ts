import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionsModule } from './auctions/auctions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BidsModule } from './bids/bids.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './auctions/entities/auction.entity';
import { AuctionItem } from './auctions/auctionitems/entities/auction.item.entity';
import { AuctionitemsModule } from './auctions/auctionitems/auctionitems.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DynamoDbModule } from './database/dynamo.db.module';
import { LogmoduleModule } from './logmodule/logmodule.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Auction, AuctionItem],
        synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE', true),// I think it can be false in Prod to be careful
      }),
    }),
    AuctionsModule,
    AuctionitemsModule,
    BidsModule,
    DynamoDbModule,
    LogmoduleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
