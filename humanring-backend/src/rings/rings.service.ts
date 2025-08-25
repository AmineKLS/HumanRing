import { Injectable, NotFoundException } from "@nestjs/common";
import { Ring, RingDocument } from "./schemas/ring.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose/dist/common/mongoose.decorators";
import { CreateRingDto } from "./dto/create-ring.dto";
import { CreateSignatureDto } from "./dto/create-signature.dto";
import { v4 as uuidv4 } from 'uuid';
import { Signature, SignatureDocument } from "./schemas/signature.schema";
import { User } from "src/users/schemas/user.schema";

type RingWithAuthor = Ring & { authorUsername: String };

@Injectable()
export class RingsService{
  constructor(@InjectModel(Ring.name) private ringModel: Model<RingDocument>,@InjectModel(Signature.name) private signatureModel: Model<SignatureDocument>,@InjectModel(User.name) private userModel: Model<User>) {}

  async getUuidFromAuth0Sub(auth0sub: string) {
  const user = await this.userModel.findOne({ auth0sub }).exec();
  console.log('Auth0 sub passed:', auth0sub);
  console.log('User found:', user);
  if (!user) throw new Error('User not found');
  return user.uuid;
}


  async getRingByUserUuid(userUuid: string, userEmail: String): Promise<Ring[]> {
    const rings = await this.ringModel.find({ $or : [ {authorId: userUuid }, {recipientEmail: userEmail.toLowerCase()} ] }).sort({ createdAt: -1 }).lean();
    return rings;
  }

  async createRing(createRingDto: CreateRingDto, authorId: String): Promise<Ring> {
    const uuid = uuidv4();
    const newRing = new this.ringModel({
      ...createRingDto,
      authorId,
      uuid,
      status: 'en_attente'
    });
    return newRing.save();
  }

  async signRing(ringId: String, createSignatureDto: CreateSignatureDto, userId: String, status: 'signé' | 'rompu'): Promise<Ring> {
    const ring= await this.ringModel.findOne({uuid: ringId}).exec();
    if (!ring){
      throw new NotFoundException(`Ring with id ${ringId} not found`);
    }

    const newSignature = new this.signatureModel({
      ...createSignatureDto,
      ringId: ring._id,
      userId,
    });
    console.log('New signature created:', newSignature);
    await newSignature.save();

    ring.status = status;
    console.log('Ring status updated to:', ring.status);
    return ring.save();

    }

  async getRingById(ringId: String): Promise<RingWithAuthor> {
    const ring = await this.ringModel.findOne({ uuid: ringId }).exec();
    if (!ring) {
      throw new NotFoundException(`Ring with id ${ringId} not found`);
    }

    const author = await this.userModel.findOne({ uuid: ring.authorId }).exec();
    return { ...ring.toObject(), authorUsername: author?.displayName || 'Unknown' };
  }
  
  }
