import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import * as path from 'path';
import { AlbumModule } from './album/album.module';
import { PlaylistModule } from './playlist/playlist.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
    MongooseModule.forRoot(
      'mongodb+srv://root:ztjFpnxHhLScIg2G@cluster0.lueevsb.mongodb.net/?retryWrites=true&w=majority',
    ),
    TrackModule,
    AlbumModule,
    PlaylistModule,
    FileModule,
    BcryptModule,
    UsersModule,
    AuthModule,
    // TokenModule,
  ],
})
export class AppModule {}
