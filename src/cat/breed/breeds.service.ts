import { InjectRepository } from '@nestjs/typeorm';
import { BreedClass } from './breed.entity';
import { Repository } from 'typeorm';
import { BreedTransferDto } from './dto/breed-transfer.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BreedsService {
  constructor(
    @InjectRepository(BreedClass)
    private breedRepository: Repository<BreedClass>,
  ) {}

  async getAll() {
    const found = await this.breedRepository.find();
    const transfer = [];

    for (let i = 0; i < found.length; ++i) {
      transfer.push(new BreedTransferDto(found[i]));
    }
    return transfer;
  }

  async getByName(name: string) {
    return await this.breedRepository.findOne({ where: { name: name } });
  }

  async update(breed: BreedTransferDto) {
    const found = await this.breedRepository.findOne({
      where: { id: breed.id },
    });
    found.name = breed.name;
    await this.breedRepository.save(found);
  }

  async delete(id: number) {
    const found = await this.breedRepository.findOne({ where: { id: id } });
    if (!found) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await this.breedRepository.remove(found);
  }

  async create(breed: BreedTransferDto) {
    if (!(await this.breedRepository.findOne({ where: { name: breed.name } })))
      await this.breedRepository.insert(new BreedClass(breed.name));
  }
}
