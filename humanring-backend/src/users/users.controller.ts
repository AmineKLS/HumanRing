import { Controller, ForbiddenException, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { RingsService } from 'src/rings/rings.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ringsService: RingsService
  ) {}

  @Get(':uuid/rings')
  async listForUser(@Request() req: any, @Param('uuid') uuid: string) {
    console.log('JWT payload:', req.user); 

    const auth0sub = req.user?.sub;
    if (!auth0sub) {
      throw new ForbiddenException('No Auth0 sub in JWT payload');
    }

    const user = await this.usersService.findByAuth0sub(auth0sub);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.uuid !== uuid) {
      throw new ForbiddenException('Cannot access other users\' rings');
    }

    console.log('User UUID:', user.uuid);

    const rings = await this.ringsService.getRingByUserUuid(uuid, user.email);
    console.log(`Found ${rings.length} rings for user`);

    return rings;
  }
}
