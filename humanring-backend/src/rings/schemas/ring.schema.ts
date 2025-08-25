import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type RingDocument = Ring & Document;

@Schema( { timestamps: true } )
export class Ring {
  @Prop({ required: true, unique: true })
  uuid: String;

  @Prop({ type: String, ref: 'User', required: true })
  authorId: String;

  @Prop({ required: true })
  recipientEmail: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: String, enum: ['en_attente', 'signé', 'rompu'], default:'en_attente' })
  status: String;

}

export const RingSchema = SchemaFactory.createForClass(Ring);