import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Track, TrackDocument } from '../../track/schemas/track.schema';
import { User } from 'src/modules/users/schemas/users.schema';

export type PlaylistDocument = Playlist & Document;

@Schema()
export class Playlist {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: TrackDocument[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
