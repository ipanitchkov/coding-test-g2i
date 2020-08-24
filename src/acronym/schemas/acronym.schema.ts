import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Acronym extends Document {
  @Prop()
  _id: string;
  @Prop()
  name: string;
  @Prop()
  definition: string;
}

export const AcronymSchema = SchemaFactory.createForClass(Acronym);
