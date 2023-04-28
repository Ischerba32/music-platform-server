import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { AddTrackDto } from './dto/add-track.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreatePlaylistDto, picture): Promise<Playlist> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const playlist = await this.playlistModel.create({
      ...dto,
      picture: picturePath,
    });

    return playlist;
  }

  async addTrackToPlaylist(dto: AddTrackDto) {
    const playlist = await this.playlistModel.findById(dto.playlistId);
    console.log(dto);
    playlist.tracks.push(dto.trackId);
    await playlist.save();
    return playlist;
  }

  async getAll(count: number, offset: number) {
    const playlists = await this.playlistModel
      .find()
      .skip(Number(offset))
      .limit(Number(count));
    return playlists;
  }

  async search(query: string) {
    const playlist = await this.playlistModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return playlist;
  }

  async getOne(id: ObjectId) {
    const playlist = await this.playlistModel.findById(id).populate('tracks');
    return playlist;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const playlist = await this.playlistModel.findByIdAndDelete(id);
    return playlist._id;
  }
}
