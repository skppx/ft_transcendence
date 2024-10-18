import {
  Controller,
  UseGuards,
  UsePipes,
  Logger,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Param,
  Body,
  Put,
  Req,
  Res
} from '@nestjs/common';
import { ApiGuard } from 'src/auth/guards/api.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/database/service/users.service';
import * as bcrypt from 'bcrypt';
import { CONST_SALT } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';
import { RemoveService } from './service/remove.service';
import {
  ProfileValidationPipe,
  updateProfileSchema
} from './pipe/profile-validation.pipe';

type UpdateProfileDto = {
  username: string;
  password: string;
};

@Controller('user')
@UseGuards(ApiGuard, JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(
    private readonly usersService: UsersService,
    private readonly removeService: RemoveService,
    private readonly authService: AuthService
  ) {}

  @Post('jwt')
  async getUserWithJwt(@Body('jwt') jwt: string) {
    const result = await this.authService.findUserByJWT(jwt);

    if (result) {
      return this.removeService.removeSensitiveData(result);
    }
    return null;
  }

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.removeService.removeSensitiveData({ username });
  }

  @Get('game-stats/:username')
  async getGameState(@Param('username') username: string) {
    const user = await this.usersService.getUserWithMatchHistory(username);
    if (user) {
      const { matchWinned, matchLost } = user;
      return { nbWin: matchWinned.length, nbLoose: matchLost.length };
    }
    return [];
  }

  @Get('match-history/:username')
  async getMatchHistory(@Param('username') username: string) {
    const user = await this.usersService.getUserWithMatchHistory(username);
    if (user) {
      const { matchWinned, matchLost } = user;
      const allMatch = [...matchWinned, ...matchLost];
      const matchSortedByDate = allMatch.sort(
        (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf()
      );
      const formattedMatch = matchSortedByDate.map((m) => ({
        id: m.id,
        playerWin: m.playerWin.username,
        playerLoose: m.playerLoose.username,
        winnerScore: m.winnerScore,
        looserScore: m.looserScore,
        timestamp: m.timestamp,
        mode: m.mode
      }));
      return formattedMatch;
    }
    return [];
  }

  @Post('check')
  async checkProfile(@Body('username') username: string) {
    const user = await this.usersService.getUser({ username });
    return user === null;
  }

  @Post('2fa-check')
  async checkTwoAuth(@Body('username') username: string) {
    const user = await this.usersService.getUser({ username });
    return user?.twoAuthOn || null;
  }

  @Put('update_profile')
  @UsePipes(new ProfileValidationPipe(updateProfileSchema))
  async updateProfile(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body() updatedUser: Partial<UpdateProfileDto>
  ) {
    if (updatedUser.username !== undefined) {
      const checkUsername = await this.usersService.getUser({
        username: updatedUser.username
      });

      if (checkUsername)
        throw new HttpException('Invalid Username', HttpStatus.BAD_REQUEST);

      const usernameAndHash = req.cookies.api_token;
      const currentUser = await this.usersService.getUser(req.user);
      if (!currentUser)
        throw new HttpException('Invalid User', HttpStatus.UNAUTHORIZED);

      // eslint-disable-next-line
      const [username, hash] = usernameAndHash.split('|');
      const newCookie = `${updatedUser.username}|${hash}`;
      res.cookie('api_token', newCookie, {
        maxAge: currentUser.maxAge,
        sameSite: 'lax',
        httpOnly: true
      });
    }

    if (updatedUser.password !== undefined) {
      const salt = await bcrypt.genSalt(CONST_SALT);
      const hashPassword = await bcrypt.hash(updatedUser.password, salt);
      updatedUser.password = hashPassword;
    }
    await this.usersService.updateUser(req.user, updatedUser);
  }

  @Get('addFriend/:uuid')
  async addFriend(@Req() req: any, @Param('uuid') uuid: string) {
    const otherUser = await this.usersService.getUserById(uuid);
    const user = await this.usersService.getUser(req.user);
    if (user && otherUser) {
      const { friendList } = user;
      const otherFriendList = otherUser.friendList;
      if (friendList.includes(uuid) === false) {
        await this.usersService.updateUser(req.user, {
          friendList: [...friendList, uuid]
        });
      }
      if (otherFriendList.includes(uuid) === false) {
        await this.usersService.updateUser(otherUser, {
          friendList: [...otherFriendList, user.id]
        });
      }
    }
  }

  @Get('removeFriend/:uuid')
  async removeFriend(@Req() req: any, @Param('uuid') uuid: string) {
    const otherUser = await this.usersService.getUserById(uuid);
    const user = await this.usersService.getUser(req.user);
    if (user && otherUser) {
      const friendList = user.friendList.filter((f) => f !== uuid);
      const otherFriendList = otherUser.friendList.filter((f) => f !== user.id);
      await this.usersService.updateUser(req.user, {
        friendList: [...friendList]
      });
      await this.usersService.updateUser(otherUser, {
        friendList: [...otherFriendList]
      });
    }
  }
}
