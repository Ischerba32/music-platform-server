import { Injectable } from '@nestjs/common';
import { UserRole } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    dto.password = await this.bcryptService.hash(dto.password);
    const user = await this.usersModel.create({
      ...dto,
      playlists: [],
      favorites: [],
      role: dto.isArtist ? UserRole.ARTIST : UserRole.USER,
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.usersModel
      .findOne({ email: email })
      .populate('favorites');
  }

  async getOne(id: ObjectId): Promise<User> {
    const user = (await this.usersModel.findById(id)).populate('favorites');
    return user;
  }

  async getUserIdbyToken(token: string): Promise<string> {
    const { user } = await this.tokenService.verifyToken(token);
    return user.id;
  }

  async getAll(): Promise<User[]> {
    const users = await this.usersModel.find();
    return users;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const user = await this.usersModel.findByIdAndDelete(id);
    return user._id;
  }
}
