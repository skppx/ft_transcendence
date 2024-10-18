import {
  Controller,
  Req,
  Res,
  Get,
  Post,
  UploadedFile,
  Logger,
  UseInterceptors,
  UseGuards,
  Param
} from '@nestjs/common';
import { join } from 'path';
import { ApiGuard } from 'src/auth/guards/api.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImgService } from './img.service';
import { FileValidationPipe } from './pipe/file-validation.pipe';
import { IUsers } from '../database/service/interface/users';
import { ChannelService } from '../database/service/channel.service';

@Controller('img')
@UseGuards(ApiGuard, JwtAuthGuard)
export class ImgController {
  private logger = new Logger('ImgController');

  constructor(
    private readonly imgService: ImgService,
    private readonly authService: AuthService,
    private readonly chanService: ChannelService
  ) {
    this.logger.log('ImgController Init...');
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Req() req: any,
    @Res() res: any,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File
  ) {
    const jwt = req.headers.authorization.replace('Bearer ', '');
    const user = await this.authService.findUserByJWT(jwt);
    if (!user) return;

    const fileName = this.imgService.writeFile(file);
    if (!fileName) return;

    this.imgService.deleteFile(user.img);
    const { twoAuthOn, twoAuthSecret, ...remaningUser } = user;
    const properlyFormatedUser: Partial<IUsers> = {
      ...remaningUser,
      twoAuth: {
        twoAuthOn,
        twoAuthSecret: twoAuthSecret || undefined
      }
    };
    this.authService.updateUser(properlyFormatedUser, {
      img: `${join(__dirname, `../../img/${fileName}`)}`
    });
    res.status(200).json({ message: 'ok' });
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadChannelPicture(
    @Param('id') chanID: string,
    @Req() req: any,
    @Res() res: any,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File
  ) {
    const jwt = req.headers.authorization.replace('Bearer ', '');
    const user = await this.authService.findUserByJWT(jwt);
    if (!user) return;

    const channel = await this.chanService.getChanById(chanID);
    if (!channel || user.id !== channel.creatorID) return;

    const fileName = this.imgService.writeFile(file);
    if (!fileName) return;

    this.imgService.deleteFile(channel.img);
    const img = `${join(__dirname, `../../img/${fileName}`)}`;
    this.chanService.updateImg(chanID, img);
    res.status(200).json({ message: 'ok' });
  }

  @Get('download')
  async getUserImage(@Req() req: any) {
    const jwt = req.headers.authorization.replace('Bearer ', '');
    const user = await this.authService.findUserByJWT(jwt);
    if (user) {
      const imgValue = this.imgService.imageToBase64(user?.img);
      return { username: user.username, uuid: user.id, ...imgValue };
    }
    return null;
  }

  @Get('download_channel/:id')
  async getChannelImage(@Req() req: any, @Param('id') chanID: string) {
    const jwt = req.headers.authorization.replace('Bearer ', '');
    const user = await this.authService.findUserByJWT(jwt);
    if (!user) return null;

    const channel = await this.chanService.getChanById(chanID);
    if (!channel) return null;

    const imgValue = this.imgService.imageToBase64(channel.img);
    return { chanName: channel.chanName, ...imgValue };
  }

  // use this route for fetching on specific user
  @Get('download/:username')
  async findUserImage(@Param('username') username: string) {
    const user = await this.authService.findUser({ username });
    if (user) {
      const imgValue = this.imgService.imageToBase64(user?.img);
      return { username: user.username, tofind_uuid: user.id, ...imgValue };
    }
    return null;
  }

  @Get('downloadById/:id')
  async findUserByIdImage(@Param('id') id: string) {
    const user = await this.authService.findUserById(id);
    if (user) {
      const imgValue = this.imgService.imageToBase64(user?.img);
      return { username: user.username, tofind_uuid: user.id, ...imgValue };
    }
    return null;
  }
}
