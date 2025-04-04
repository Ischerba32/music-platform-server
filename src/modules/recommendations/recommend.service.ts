import { Injectable } from '@nestjs/common';
import { CreateRecommendDto } from './dto/create-recommend-dto';
import { Recommend, RecommendDocument } from './schemas/recommend.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AddTrackDto } from './dto/add-track.dto';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class RecommendService {
  constructor(
    @InjectModel(Recommend.name)
    private recommendModel: Model<RecommendDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateRecommendDto, picture): Promise<Recommend> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const recommend = await this.recommendModel.create({
      ...dto,
      picture: picturePath,
      tracks: [],
    });

    return recommend;
  }

  async addTrackToRecommend(dto: AddTrackDto) {
    const recommend = await this.recommendModel.findById(dto.recommendId);
    recommend.tracks.push(dto.trackId);
    await recommend.save();
    return recommend;
  }

  async removeTrackFromRecommend(dto: AddTrackDto) {
    return this.recommendModel
      .findByIdAndUpdate(
        dto.recommendId,
        { $pull: { tracks: dto.trackId } },
        { new: true },
      )
      .populate('tracks')
      .exec();
  }

  async getAll(count: number, offset: number): Promise<Recommend[]> {
    const recommends = await this.recommendModel
      .find()
      .skip(Number(offset))
      .limit(Number(count))
      .populate('tracks');
    return recommends;
  }

  async getOne(id: ObjectId) {
    const recommend = await this.recommendModel.findById(id).populate('tracks');
    // .exec();
    return recommend;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const recommend = await this.recommendModel.findByIdAndDelete(id);
    return recommend._id;
  }

  async search(query: string) {
    const recommends = await this.recommendModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return recommends;
  }
}
