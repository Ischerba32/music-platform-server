import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { Track } from 'src/track/schemas/track.schema';
import { UserRole } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }] })
  playlists: Playlist[];

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  favorites: Track[];

  @Prop()
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
