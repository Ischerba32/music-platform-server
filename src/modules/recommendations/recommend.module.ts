import { Module } from '@nestjs/common';
import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recommend, RecommendSchema } from './schemas/recommend.schema';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recommend.name, schema: RecommendSchema },
    ]),
  ],
  controllers: [RecommendController],
  providers: [RecommendService, FileService],
})
export class RecommendModule {}
