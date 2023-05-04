import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { PlaylistService } from './playlist.service';
import { AddTrackDto } from './dto/add-track.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RolesGuard } from 'src/guards/roles-guard';
import { UserRole } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';

@Controller('/playlists')
export class PlaylistController {
  constructor(
    private playlistService: PlaylistService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(@UploadedFiles() files, @Body() dto: CreatePlaylistDto) {
    const { picture } = files;
    return this.playlistService.create(dto, picture[0]);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('/track')
  addTrackToPlaylist(@Body() dto: AddTrackDto) {
    return this.playlistService.addTrackToPlaylist(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('/delete-track')
  removeTrackFromPlaylist(@Body() dto: AddTrackDto) {
    return this.playlistService.removeTrackFromPlaylist(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  async getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Headers('authorization') headers,
  ) {
    const accessToken = headers.split(' ')[1];
    const userId = await this.usersService.getUserIdbyToken(accessToken);
    return this.playlistService.getAll(count, offset, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('/search')
  search(@Query('query') query: string) {
    return this.playlistService.search(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.playlistService.getOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.playlistService.delete(id);
  }
}
