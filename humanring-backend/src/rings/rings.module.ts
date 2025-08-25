import { forwardRef, Module } from '@nestjs/common';
import { RingsService } from './rings.service';
import { RingsController } from './rings.controller';
import { Signature, SignatureSchema } from './schemas/signature.schema';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Ring, RingSchema } from './schemas/ring.schema';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Ring.name, schema: RingSchema }]),
    MongooseModule.forFeature([{ name: Signature.name, schema: SignatureSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [RingsService],
  controllers: [RingsController],
  exports: [RingsService],
})
export class RingsModule {}
