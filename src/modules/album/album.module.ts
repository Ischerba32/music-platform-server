import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from '../file/file.service';
import { AlbumController } from './album.controller';
import { Album, AlbumSchema } from './schemas/album.schema';
import { AlbumService } from './album.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, FileService],
})
export class AlbumModule {}
