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
} from '@nestjs/common';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RolesGuard } from 'src/guards/roles-guard';
import { UserRole } from '../users/interfaces/user.interface';
import { RecommendService } from './recommend.service';
import { CreateRecommendDto } from './dto/create-recommend-dto';
import { AddTrackDto } from './dto/add-track.dto';
import { ObjectId } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/recommends')
export class RecommendController {
  constructor(private recommendService: RecommendService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(@UploadedFiles() files, @Body() dto: CreateRecommendDto) {
    const { picture } = files;
    return this.recommendService.create(dto, picture[0]);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('/track')
  addTrackToPlaylist(@Body() dto: AddTrackDto) {
    return this.recommendService.addTrackToRecommend(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('/delete-track')
  removeTrackFromPlaylist(@Body() dto: AddTrackDto) {
    return this.recommendService.removeTrackFromRecommend(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.recommendService.getAll(count, offset);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/search')
  search(@Query('query') query: string) {
    return this.recommendService.search(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.recommendService.getOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.recommendService.delete(id);
  }
}
