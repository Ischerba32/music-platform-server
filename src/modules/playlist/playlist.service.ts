import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from '../file/file.service';
import { AddTrackDto } from './dto/add-track.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';
// import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/schemas/users.schema';
import { Track, TrackDocument } from '../track/schemas/track.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    private fileService: FileService, // @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  async create(dto: CreatePlaylistDto, picture): Promise<Playlist> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const playlist = await this.playlistModel.create({
      name: dto.name,
      owner: dto.owner,
      picture: picturePath,
      tracks: [],
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

  async removeTrackFromPlaylist(dto: AddTrackDto) {
    return this.playlistModel
      .findByIdAndUpdate(
        dto.playlistId,
        { $pull: { tracks: dto.trackId } },
        { new: true },
      )
      .populate('tracks')
      .exec();
  }

  async getAll(count: number, offset: number, userId: string) {
    const playlists = await this.playlistModel
      .find({ owner: userId })
      .skip(Number(offset))
      .limit(Number(count))
      .populate('tracks');
    return playlists;
  }

  async search(query: string) {
    const playlist = await this.playlistModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return playlist;
  }

  async getOne(id: ObjectId) {
    const playlist = await this.playlistModel
      .findById(id)
      .populate('tracks')
      .populate('owner');
    // .exec();
    return playlist;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const playlist = await this.playlistModel.findByIdAndDelete(id);
    return playlist._id;
  }
}
