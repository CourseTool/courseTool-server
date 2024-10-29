import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { communityEntity } from '../../entities/community.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(communityEntity)
    private readonly communityMapper: Repository<communityEntity>,
  ) {}

  async getListByType(type: string) {
    const list = await this.communityMapper.find({
      where: {
        type,
      },
    });
    list.forEach((item) => {
      item.img_list = JSON.parse(item.img_list);
    });
    return list;
  }
}
