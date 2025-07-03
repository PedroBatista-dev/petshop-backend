// src/cargo/cargo.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './entities/cargo.entity';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto'; // Importe

@Injectable()
export class CargoService {
  constructor(
    @InjectRepository(Cargo)
    private cargosRepository: Repository<Cargo>,
  ) {}

  async create(createCargoDto: CreateCargoDto): Promise<Cargo> {
    const existingCargo = await this.cargosRepository.findOne({ where: { descricao: createCargoDto.descricao } });
    if (existingCargo) {
      throw new ConflictException('Já existe um cargo com esta descrição.');
    }
    const newCargo = this.cargosRepository.create(createCargoDto);
    return this.cargosRepository.save(newCargo);
  }

  async findOneById(id: string): Promise<Cargo | undefined> {
    return this.cargosRepository.findOne({ where: { id } });
  }

  async findOneByDescricao(descricao: string): Promise<Cargo | undefined> {
    return this.cargosRepository.findOne({ where: { descricao } });
  }

  async findAll(): Promise<Cargo[]> {
    return this.cargosRepository.find();
  }

  async update(id: string, updateCargoDto: UpdateCargoDto): Promise<Cargo> {
    const cargo = await this.findOneById(id);
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }
    Object.assign(cargo, updateCargoDto);
    return this.cargosRepository.save(cargo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cargosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Cargo não encontrado para remoção.');
    }
  }
}