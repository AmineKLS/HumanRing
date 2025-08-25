import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export type SignatureDocument = Signature & Document;

@Schema({timestamps: { createdAt: 'signedAt', updatedAt: false }})
export class Signature {
  @Prop({ type: String, ref:'Ring', required: true })
  ringId: String;

  @Prop({ required: true })
  userId: String;

  @Prop()
  signatureText: String;

  @Prop()
  audioURL: String;

  @Prop()
  videoURL: String;

}

export const SignatureSchema = SchemaFactory.createForClass(Signature);