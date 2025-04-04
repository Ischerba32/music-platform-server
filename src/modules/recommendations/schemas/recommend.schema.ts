import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TrackDocument } from 'src/modules/track/schemas/track.schema';

export type RecommendDocument = Recommend & Document;

@Schema()
export class Recommend {
  @Prop()
  name: string;

  @Prop()
  genre: string;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: TrackDocument[];
}

export const RecommendSchema = SchemaFactory.createForClass(Recommend);
