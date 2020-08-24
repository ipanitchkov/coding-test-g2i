import { Module } from '@nestjs/common';
import { AcronymService } from './acronym.service';
import { AcronymController } from './acronym.controller';
import { AcronymSchema } from './schemas/acronym.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AcronymController],
  exports: [AcronymService],
  imports: [
    MongooseModule.forFeature([{ name: 'Acronym', schema: AcronymSchema }]),
  ],
  providers: [AcronymService],
})
export class AcronymModule {}
