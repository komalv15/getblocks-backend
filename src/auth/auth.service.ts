import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IUserModel,
  USER_MODEL,
  UserDocument,
} from 'src/mongodb/schema/user.schema';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}
  async signup(createAuthDto: SignUpDto) {
    const { email, password, username } = createAuthDto;
    try {
      if (Object.keys(createAuthDto).length === 0) {
        throw new HttpException('Need to feed data', HttpStatus.BAD_GATEWAY);
      }
      const validateUser = await this.getUser(email);

      const hashedPassword = await hash(password, 16);
      createAuthDto.password = hashedPassword;

      if (validateUser) {
        throw new HttpException('Already have account', HttpStatus.CONFLICT);
      }
      const user = await this.userModel.create({
        username: createAuthDto.username,
        email: createAuthDto.email,
        password: hashedPassword,
      });

      return {
        status: true,
        data: user,
        message: 'Successfully Register User',
      };
    } catch (error) {
      return {
        status: false,
        data: {},
        message: error.message || 'somthing went wrong',
      };
    }
  }

  async signIn(signindata: SignInDto) {
    const { email, password } = signindata;
    try {
      if (!password && !email) {
        throw new HttpException('Complete all fields', HttpStatus.BAD_GATEWAY);
      }

      // const user = await this.getUser(email);
      const user = await this.userModel.findOne({ email });

      const isPassMatched = await user.isValidPassword(password);

      if (!isPassMatched) {
        throw new UnauthorizedException();
      }

      if (!user) {
        throw new HttpException('User Non found', HttpStatus.NOT_FOUND);
      }

      user.password = undefined;

      return {
        status: true,
        data: user,
        message: 'User found Successfully',
      };
    } catch (error) {
      return {
        status: false,
        data: {},
        message: error.message || 'somthing went wrong',
      };
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private async getUser(email: string) {
    const user = await this.userModel.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }
}
