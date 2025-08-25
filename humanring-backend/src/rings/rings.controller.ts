import { Body, Controller, Post, UseGuards, Request, Param, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRingDto } from './dto/create-ring.dto';
import { RingsService } from './rings.service';
import { CreateSignatureDto } from './dto/create-signature.dto';


@UseGuards(JwtAuthGuard)
@Controller('rings')
export class RingsController {
  constructor(private readonly ringsService: RingsService) {}

  @Post()
  async createRing(@Body() createRingDto: CreateRingDto, @Request() req){
    console.log(req.user);
    const authorId = req.user.sub;
    const userId = await this.ringsService.getUuidFromAuth0Sub(authorId);
    return this.ringsService.createRing(createRingDto, userId);
  }

  @Post(':uuid/sign')
  async signRing(@Param('uuid') ringId: String, @Body() body: { createSignatureDto: CreateSignatureDto; status: 'signé' | 'rompu' }, @Request() req){
    const authorId = req.user.sub;
    const userId = await this.ringsService.getUuidFromAuth0Sub(authorId);
    console.log("Signing ring:", ringId, "with data:", body.createSignatureDto, "for user:", userId, "with status:", body.status);
    return this.ringsService.signRing(ringId, body.createSignatureDto, userId, body.status);
  }

  @Get(':uuid')
  async getRing(@Param('uuid') ringId: String){
    return this.ringsService.getRingById(ringId);
  }
}
