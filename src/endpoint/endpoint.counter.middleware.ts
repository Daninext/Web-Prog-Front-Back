import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EndpointEntity } from './endpoint.entity';

@Injectable()
export class EndpointCounterMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(EndpointEntity)
    private readonly endpointRepository: Repository<EndpointEntity>,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    let path = await this.endpointRepository.findOne({
      where: { path: res.req.baseUrl },
    });

    if (path) {
      path.increaseCount();
      await this.endpointRepository.save(path);
    } else {
      path = new EndpointEntity(res.req.baseUrl);
      path.increaseCount();
      await this.endpointRepository.insert(path);
    }
    next();
  }
}
