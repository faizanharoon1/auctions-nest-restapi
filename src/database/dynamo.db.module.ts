import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBService } from './dynamo.db.service';


@Module({
  imports: [ConfigModule],
  providers: [DynamoDBService],
  exports: [DynamoDBService],
})
export class DynamoDbModule {}
