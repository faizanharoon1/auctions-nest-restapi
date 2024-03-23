import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logmodule/logmodule.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  logger: new MyLogger()
});
   // Enable CORS
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
