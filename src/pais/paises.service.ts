// src/pais/pais.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from './entities/pais.entity';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Pais)
    private paisesRepository: Repository<Pais>,
  ) {}

  async create(createPaisDto: CreatePaisDto, idEmpresa: string): Promise<Pais> {
    const existingPais = await this.paisesRepository.findOne({
      where: { descricao: createPaisDto.descricao, idEmpresa },
    });
    if (existingPais) {
      throw new ConflictException('Já existe um país com esta descrição.');
    }
    const novoPais = this.paisesRepository.create(createPaisDto);

    return this.paisesRepository.save(novoPais);
  }

  async findOneById(id: string, idEmpresa: string): Promise<Pais | undefined> {
    return this.paisesRepository.findOne({ where: { id, idEmpresa } });
  }

  async findAll(idEmpresa: string): Promise<Pais[]> {
    return this.paisesRepository.find({ where: { idEmpresa } });
  }

  async update(
    id: string,
    updatePaisDto: UpdatePaisDto,
    idEmpresa: string,
  ): Promise<Pais> {
    const pais = await this.findOneById(id, idEmpresa);
    if (!pais) {
      throw new NotFoundException('País não encontrado.');
    }

    Object.assign(pais, updatePaisDto);
    return this.paisesRepository.save(pais);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paisesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('País não encontrado para remoção.');
    }
  }
}
