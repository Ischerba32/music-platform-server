import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './modules/file/file.module';
import { TrackModule } from './modules/track/track.module';
import * as path from 'path';
import { AlbumModule } from './modules/album/album.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { BcryptModule } from './modules/bcrypt/bcrypt.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://root:ztjFpnxHhLScIg2G@cluster0.lueevsb.mongodb.net/?retryWrites=true&w=majority',
    ),
    TrackModule,
    AlbumModule,
    PlaylistModule,
    BcryptModule,
    UsersModule,
    AuthModule,
    FileModule,
  ],
})
export class AppModule {}
