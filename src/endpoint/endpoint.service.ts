import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EndpointEntity } from './endpoint.entity';
import { Repository } from 'typeorm';
import { EndpointDto } from './dto/endpoint.dto';

@Injectable()
export class EndpointService {
  constructor(
    @InjectRepository(EndpointEntity)
    private endpointRepository: Repository<EndpointEntity>,
  ) {}

  async getStatistic() {
    const paths = await this.endpointRepository.find();
    paths.sort((a, b) => b.count - a.count);

    const transfer = [];
    for (let i = 0; i < paths.length; ++i) {
      transfer.push(new EndpointDto(paths[i].path, paths[i].count));
    }

    return { paths: transfer };
  }
}
