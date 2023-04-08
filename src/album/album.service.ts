import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { AddTrackDto } from './dto/add-track.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateAlbumDto, picture): Promise<Album> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const album = await this.albumModel.create({
      ...dto,
      picture: picturePath,
    });

    return album;
  }

  async addTrackToAlbum(dto: AddTrackDto) {
    const album = await this.albumModel.findById(dto.albumId);
    console.log(dto);
    album.tracks.push(dto.trackId);
    await album.save();
    return album;
  }

  async getAll(count: number, offset: number) {
    const albums = await this.albumModel
      .find()
      .skip(Number(offset))
      .limit(Number(count));
    return albums;
  }

  async search(query: string) {
    const album = await this.albumModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return album;
  }

  async getOne(id: ObjectId) {
    const album = await this.albumModel.findById(id).populate('tracks');
    return album;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const album = await this.albumModel.findByIdAndDelete(id);
    return album._id;
  }
}
