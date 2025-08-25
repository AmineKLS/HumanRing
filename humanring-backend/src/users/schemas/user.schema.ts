import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User {

  @Prop({ required: true, unique: true })
  auth0sub: String;

  @Prop({ required: true, unique: true })
  uuid: String;

  @Prop({ required: true, unique: true })
  email: String;

  @Prop({ required: true })
  displayName: String;
}

export const UserSchema = SchemaFactory.createForClass(User);