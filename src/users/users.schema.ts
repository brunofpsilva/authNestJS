import * as bcrypt from 'bcrypt';
import { Role } from './types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: Role;

  @Prop()
  hash: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  nif: string;

  @Prop()
  address: string;

  @Prop()
  country: string;

  @Prop()
  obs: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
  const now = new Date();
  try {
    if (!this.isModified('password')) {
      return next();
    }
    this.updated_at = now;
    if (!this.created_at) {
      this.created_at = now;
    }
    this['password'] = await bcrypt.hash(this['password'], 10);
    return next();
  } catch (err) {
    return next(err);
  }
});
