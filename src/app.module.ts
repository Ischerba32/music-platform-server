import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import * as path from 'path';
import { AlbumModule } from './album/album.module';
import { PlaylistModule } from './playlist/playlist.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
    MongooseModule.forRoot(
      'mongodb+srv://root:ztjFpnxHhLScIg2G@cluster0.lueevsb.mongodb.net/?retryWrites=true&w=majority',
    ),
    TrackModule,
    AlbumModule,
    PlaylistModule,
    FileModule,
  ],
})
export class AppModule {}
