import { databaseUrl } from '../config.json';
import { Module } from '@nestjs/common';
import { AcronymModule } from './acronym/acronym.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  exports: [],
  imports: [
    AcronymModule,
    MongooseModule.forRoot(databaseUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
  ],
  providers: [],
})
export class AppModule {}
