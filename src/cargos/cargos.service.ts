// src/cargo/cargo.service.ts
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './entities/cargo.entity';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo)
    private cargosRepository: Repository<Cargo>,
  ) {}

  async create(
    createCargoDto: CreateCargoDto,
    idEmpresa: string,
  ): Promise<Cargo> {
    const existingCargo = await this.cargosRepository.findOne({
      where: { descricao: createCargoDto.descricao, idEmpresa },
    });
    if (existingCargo) {
      throw new ConflictException('Já existe um cargo com esta descrição.');
    }

    createCargoDto.idEmpresa = idEmpresa;

    const novoCargo = this.cargosRepository.create(createCargoDto);
    return this.cargosRepository.save(novoCargo);
  }

  async findOneById(
    id: string,
    idEmpresa?: string,
  ): Promise<Cargo | undefined> {
    if (idEmpresa) {
      return this.cargosRepository.findOne({
        where: { id, idEmpresa, canBeDeleted: true },
      });
    }
    return this.cargosRepository.findOne({
      where: { id, canBeDeleted: false },
    });
  }

  async findOneByDescricao(
    descricao: string,
    canBeDeleted: boolean,
    idEmpresa?: string,
  ): Promise<Cargo | undefined> {
    if (idEmpresa) {
      return this.cargosRepository.findOne({
        where: { descricao, idEmpresa, canBeDeleted },
      });
    }
    return this.cargosRepository.findOne({
      where: { descricao, canBeDeleted },
    });
  }

  async findAll(idEmpresa: string): Promise<Cargo[]> {
    return this.cargosRepository.find({
      where: { idEmpresa, canBeDeleted: true },
    });
  }

  async update(
    id: string,
    updateCargoDto: UpdateCargoDto,
    idEmpresa: string,
  ): Promise<Cargo> {
    const cargo = await this.findOneById(id, idEmpresa);
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    Object.assign(cargo, updateCargoDto);
    return this.cargosRepository.save(cargo);
  }

  async remove(id: string, idEmpresa: string): Promise<void> {
    const cargo = await this.findOneById(id, idEmpresa);

    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    if (!cargo.canBeDeleted) {
      throw new ForbiddenException('Este cargo não pode ser deletado.');
    }

    const result = await this.cargosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Cargo não encontrado para remoção.');
    }
  }
}
