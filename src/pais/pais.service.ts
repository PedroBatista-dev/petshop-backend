// src/pais/pais.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from './entities/pais.entity';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto'; // Importe

@Injectable()
export class PaisService {
  constructor(
    @InjectRepository(Pais)
    private paisesRepository: Repository<Pais>,
  ) {}

  async create(createPaisDto: CreatePaisDto): Promise<Pais> {
    const existingPais = await this.paisesRepository.findOne({ where: { descricao: createPaisDto.descricao } });
    if (existingPais) {
      throw new ConflictException('Já existe um país com esta descrição.');
    }
    const newPais = this.paisesRepository.create(createPaisDto);
    // Campos de auditoria quemCriouId e quemAlterouId serão preenchidos pelo interceptor no DTO
    return this.paisesRepository.save(newPais);
  }

  async findOneById(id: string): Promise<Pais | undefined> {
    return this.paisesRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Pais[]> {
    return this.paisesRepository.find();
  }

  async update(id: string, updatePaisDto: UpdatePaisDto): Promise<Pais> {
    const pais = await this.findOneById(id);
    if (!pais) {
      throw new NotFoundException('País não encontrado.');
    }
    Object.assign(pais, updatePaisDto);
    // quemAlterouId será preenchido pelo interceptor no DTO
    return this.paisesRepository.save(pais);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paisesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('País não encontrado para remoção.');
    }
  }
}