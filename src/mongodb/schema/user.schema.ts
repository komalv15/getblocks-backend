import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Transform } from 'class-transformer';
import { Document, Model, Query, ObjectId } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'users',
  statics: {
    async findEmailAndPassword(
      this: IUserModel,
      email: string,
      password: string,
    ) {
      const user = await this.findOne<UserDocument>({ email }, '+password');

      if (!user) return;

      // const isPassMatched = await compare(password ,user.password);
      const isPassMatched = await user.isValidPassword(password);

      if (!isPassMatched) return;

      return user;
    },
  },
})
export class User {
  @Transform(({ value }: { value: ObjectId }) => `${value}`)
  public _id?: string;

  @Prop({ required: true, trim: true })
  public username: string;

  @Prop({ required: true, unique: true, trim: true })
  public email: string;

  @Prop({ required: true, trim: true })
  public password!: string;

  isValidPassword: (candidatePassword: string) => Promise<boolean>;
}

export type UserDocument = User & Document;
export const USER_MODEL = User.name; // User

const schema = SchemaFactory.createForClass(User);
export const UserSchema = schema;

//password hashing
UserSchema.pre('save', async function (next) {
  const hashedPassword = await hash(this.password, 16);
  this.password = hashedPassword;
  next();
});

//Instance Methods
schema.methods.isValidPassword = async function (
  this: UserDocument,
  candidatePassword: string,
) {
  const hashedPassword = this.password;
  const isMatched = await compare(candidatePassword, hashedPassword);
  
  return isMatched;
};

// Handle email and password checking
export interface IUserModel extends Model<UserDocument> {
  findEmailAndPassword: (
    email: string,
    password: string,
  ) => Promise<UserDocument | undefined>;
}

// export type UserModelQuery = Query<any, UserDocument, IUserQueryHelpers> &
//   IUserQueryHelpers;
// export interface IUserQueryHelpers {
//   byName(this: UserModelQuery, name: string): UserModelQuery;
// }
