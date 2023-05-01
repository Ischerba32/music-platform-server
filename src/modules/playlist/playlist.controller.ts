import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { PlaylistService } from './playlist.service';
import { AddTrackDto } from './dto/add-track.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Controller('/playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(@UploadedFiles() files, @Body() dto: CreatePlaylistDto) {
    const { picture } = files;
    return this.playlistService.create(dto, picture[0]);
  }

  @Post('/track')
  addTrackToPlaylist(@Body() dto: AddTrackDto) {
    return this.playlistService.addTrackToPlaylist(dto);
  }

  @Get()
  getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.playlistService.getAll(count, offset);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.playlistService.search(query);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.playlistService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.playlistService.delete(id);
  }
}
