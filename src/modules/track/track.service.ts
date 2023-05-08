import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Track, TrackDocument } from './schemas/track.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from '../file/file.service';

import { getAudioDurationInSeconds } from 'get-audio-duration';
import * as path from 'path';
import { AddTrackToUserFavsDto } from './dto/add-track-to-users-favs.dto';
import { User, UserDocument } from '../users/schemas/users.schema';
import {
  Playlist,
  PlaylistDocument,
} from '../playlist/schemas/playlist.schema';
import {
  Recommend,
  RecommendDocument,
} from '../recommendations/schemas/recommend.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    @InjectModel(Recommend.name)
    private recommendModel: Model<RecommendDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const duration = Math.ceil(
      await getAudioDurationInSeconds(
        path.resolve(__dirname, '..', '..', 'static', audioPath),
      ),
    );
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
      duration,
    });
    return track;
  }

  async getAll(count = 20, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel
      .find()
      .skip(Number(offset))
      .limit(Number(count))
      .populate('artist');
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel
      .findById(id)
      .populate('comments')
      .populate('artist');
    return track;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track._id;
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async addTrackToUserFavs(dto: AddTrackToUserFavsDto): Promise<Track> {
    const user = await this.userModel.findById(dto.userId);
    const track = await this.trackModel.findById(dto.trackId);
    user.favorites.push(track._id);
    await user.save();
    return track;
  }

  async removeTrackFromUserFavs(dto: AddTrackToUserFavsDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        dto.userId,
        { $pull: { favorites: dto.trackId } },
        { new: true },
      )
      .populate('favorites')
      .exec();
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    await track.save();
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }

  async getUnaddedTracks(entityId: ObjectId, type: string): Promise<any> {
    let entity;
    if (type === 'playlist') {
      entity = await this.playlistModel.findById(entityId).populate({
        path: 'tracks',
        populate: {
          path: 'artist',
        },
      });
    } else {
      entity = await this.recommendModel.findById(entityId).populate({
        path: 'tracks',
        populate: {
          path: 'artist',
        },
      });
    }

    const tracksInPlaylist = entity.tracks;

    const allTracks = await this.trackModel.find().populate('artist');

    const unaddedTracks = allTracks.filter(
      (track) =>
        !tracksInPlaylist.some(
          (trackInPlaylist) => trackInPlaylist.id === track.id,
        ),
    );
    return unaddedTracks;
  }
}
