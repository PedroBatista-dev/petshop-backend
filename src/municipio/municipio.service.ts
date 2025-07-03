// src/municipio/municipio.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from './entities/municipio.entity';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto'; // Importe

@Injectable()
export class MunicipioService {
  constructor(
    @InjectRepository(Municipio)
    private municipiosRepository: Repository<Municipio>,
  ) {}

  async create(createMunicipioDto: CreateMunicipioDto): Promise<Municipio> {
    const existingMunicipio = await this.municipiosRepository.findOne({
      where: { descricao: createMunicipioDto.descricao, estado: createMunicipioDto.estado },
    });
    if (existingMunicipio) {
      throw new ConflictException('Já existe um município com esta descrição e estado.');
    }
    const newMunicipio = this.municipiosRepository.create(createMunicipioDto);
    return this.municipiosRepository.save(newMunicipio);
  }

  async findOneById(id: string): Promise<Municipio | undefined> {
    return this.municipiosRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Municipio[]> {
    return this.municipiosRepository.find();
  }

  async update(id: string, updateMunicipioDto: UpdateMunicipioDto): Promise<Municipio> {
    const municipio = await this.findOneById(id);
    if (!municipio) {
      throw new NotFoundException('Município não encontrado.');
    }
    Object.assign(municipio, updateMunicipioDto);
    return this.municipiosRepository.save(municipio);
  }

  async remove(id: string): Promise<void> {
    const result = await this.municipiosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Município não encontrado para remoção.');
    }
  }
}