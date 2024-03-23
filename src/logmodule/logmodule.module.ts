import { Module } from '@nestjs/common';
import { MyLogger } from './logmodule.service';

@Module({
  providers: [MyLogger]
})
export class LogmoduleModule {}
