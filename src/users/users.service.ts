import { HttpException, Injectable } from '@nestjs/common';
import { UserRole } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  // private readonly users: User[];

  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    private readonly bcryptService: BcryptService,
  ) {
    // this.users = [
    //   {
    //     userId: 1,
    //     username: 'john',
    //     password: 'changeme',
    //     role: UserRole.USER,
    //   },
    //   {
    //     userId: 2,
    //     username: 'jane',
    //     password: 'secret',
    //     role: UserRole.ARTIST,
    //   },
    //   {
    //     userId: 3,
    //     username: 'admin',
    //     password: 'password',
    //     role: UserRole.ADMIN,
    //   },
    // ];
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    dto.password = await this.bcryptService.hash(dto.password);
    const user = await this.usersModel.create({
      ...dto,
      playlists: [],
      favorites: [],
      role: UserRole.USER,
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.usersModel.findOne({ email: email });
  }

  async getOne(id: ObjectId): Promise<User> {
    const user = await this.usersModel.findById(id);
    return user;
  }

  // async findByUsername(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  // async findById(userId: number): Promise<User | undefined> {
  //   return this.users.find((user) => user.userId === userId);
  // }
}
