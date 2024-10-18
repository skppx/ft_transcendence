import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ChannelType, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChannelService {
  private logger = new Logger(ChannelService.name);

  constructor(private prisma: PrismaService) {}

  async createChannel(channel: Prisma.ChannelCreateInput) {
    const { chanName, type, creatorID, admins, password } = channel;
    try {
      return await this.prisma.channel.create({
        data: {
          chanName,
          type,
          creatorID,
          admins,
          password,
          members: {
            connect: {
              id: creatorID
            }
          }
        }
      });
    } catch (e) {
      if (e.name === 'PrismaClientKnownRequestError') {
        throw new ForbiddenException('Channel name must be unique');
      }
      throw new ForbiddenException('Channel creation forbiden');
    }
  }

  async updateImg(id: string, img: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          img
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async updateChanType(id: string, type: ChannelType, password?: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          type,
          password
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async getAllChanWithMembers() {
    try {
      return await this.prisma.channel.findMany({
        include: {
          members: true
        }
      });
    } catch (e: any) {
      this.logger.warn(e);
      return null;
    }
  }

  async getChanById(id: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          id
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithMessages(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          messages: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanByIdWithMessages(id: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          id
        },
        include: {
          messages: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithMessagesAndMembers(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          messages: true,
          members: true
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanByName(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        }
      });
    } catch (e) {
      this.logger.warn(e);
      throw new ForbiddenException();
    }
  }

  async getChanWithMembers(chanName: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          chanName
        },
        include: {
          members: true
        }
      });
    } catch (e) {
      this.logger.warn('getChanWithMembers', e);
      throw new ForbiddenException();
    }
  }

  async getChanByIdWithMembers(id: string) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          id
        },
        include: {
          members: true
        }
      });
    } catch (e) {
      this.logger.warn('getChanWithMembers', e);
      throw new ForbiddenException();
    }
  }

  async addChannelMemberById(id: string, memberId: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          members: {
            connect: { id: memberId }
          }
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async addChannelMember(chanName: string, memberId: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          chanName
        },
        data: {
          members: {
            connect: { id: memberId }
          }
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async removeChannelMember(id: string, memberId: string) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          members: {
            disconnect: { id: memberId }
          }
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async updateBans(id: string, bans: string[]) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          bans
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async updateMute(id: string, mute: string[]) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          mute
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async updateAdmins(id: string, admins: string[]) {
    try {
      return await this.prisma.channel.update({
        where: {
          id
        },
        data: {
          admins
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  async deleteChannelById(id: string) {
    try {
      return await this.prisma.channel.delete({
        where: {
          id
        }
      });
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }
}
