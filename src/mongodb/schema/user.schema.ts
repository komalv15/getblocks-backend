import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Transform } from 'class-transformer';
import { Document ,ObjectId } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'users',
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




