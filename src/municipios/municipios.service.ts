// src/municipio/municipio.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from './entities/municipio.entity';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto'; // Importe

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Municipio)
    private municipiosRepository: Repository<Municipio>,
  ) {}

  async create(
    createMunicipioDto: CreateMunicipioDto,
    idEmpresa: string,
  ): Promise<Municipio> {
    const existingMunicipio = await this.municipiosRepository.findOne({
      where: {
        descricao: createMunicipioDto.descricao,
        estado: createMunicipioDto.estado,
        idEmpresa,
      },
    });
    if (existingMunicipio) {
      throw new ConflictException(
        'Já existe um município com esta descrição e estado.',
      );
    }
    const novoMunicipio = this.municipiosRepository.create(createMunicipioDto);
    return this.municipiosRepository.save(novoMunicipio);
  }

  async findOneById(
    id: string,
    idEmpresa: string,
  ): Promise<Municipio | undefined> {
    return this.municipiosRepository.findOne({ where: { id, idEmpresa } });
  }

  async findAll(idEmpresa: string): Promise<Municipio[]> {
    return this.municipiosRepository.find({ where: { idEmpresa } });
  }

  async update(
    id: string,
    updateMunicipioDto: UpdateMunicipioDto,
    idEmpresa: string,
  ): Promise<Municipio> {
    const municipio = await this.findOneById(id, idEmpresa);
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
