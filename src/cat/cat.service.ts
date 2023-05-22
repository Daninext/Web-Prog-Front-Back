import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CatPhotoTransferDto } from './dto/cat-photo-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatClass } from './cat.photo.entity';
import { UserClass } from '../user/user.entity';
import { BreedClass } from './breed/breed.entity';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatClass)
    private catsRepository: Repository<CatClass>,
    @InjectRepository(BreedClass)
    private breedRepository: Repository<BreedClass>,
  ) {}

  async getRandomCat() {
    const cats = await this.catsRepository.find();
    return cats[Math.floor(Math.random() * cats.length)];
  }

  async getCatsByPage(count: number, page: number) {
    let cats = await this.catsRepository.find();
    cats = cats.reverse();

    const catTransfer = [];
    let _count = 0;
    for (let i = count * (page - 1); i < cats.length && _count < count; ++i) {
      catTransfer.push(new CatPhotoTransferDto(null, cats[i].data, null, null));
      ++_count;
    }

    return catTransfer;
  }

  async getCatsByOwnerId(ownerId: string) {
    const cats = await this.catsRepository.find({
      where: { owner: { outerId: ownerId } },
    });

    const catTransfer = [];
    for (let i = 0; i < cats.length; ++i) {
      catTransfer.push(
        new CatPhotoTransferDto(
          cats[i].id,
          cats[i].data,
          cats[i].name,
          cats[i].breed.name,
        ),
      );
    }

    return catTransfer;
  }

  async getCount() {
    const cats = await this.catsRepository.find();
    return cats.length;
  }

  async createCat(cat: CatPhotoTransferDto, user: UserClass) {
    let br = await this.breedRepository.findOne({
      where: { name: cat.breed },
    });

    if (br === null) {
      const breedC = new BreedClass(cat.breed);
      await this.breedRepository.save(breedC);
      br = await this.breedRepository.findOne({
        where: { name: cat.breed },
      });
    }

    const ncat = new CatClass(cat.data, cat.name, br);
    ncat.setUser(user);
    await this.catsRepository.save(ncat);
  }

  async deleteCat(id: number, outerId: any) {
    const cat = await this.catsRepository.find({
      where: { id: id, owner: { outerId: outerId } },
    });

    if (!cat) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    await this.catsRepository.delete({ id });
  }

  async findOneById(id: number) {
    return await this.catsRepository.findOneBy({ id: id });
  }
}
