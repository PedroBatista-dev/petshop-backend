// src/empresas/empresas.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Empresas } from './entities/empresas.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto'; // Importe

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresas)
    private empresasRepository: Repository<Empresas>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresas> {
    const existingRazaoSocial = await this.empresasRepository.findOne({ where: { razaoSocial: createEmpresaDto.razaoSocial } });
    if (existingRazaoSocial) {
      throw new ConflictException('Já existe uma empresa com esta razão social.');
    }
    const existingCnpj = await this.empresasRepository.findOne({ where: { cnpj: createEmpresaDto.cnpj } });
    if (existingCnpj) {
      throw new ConflictException('Já existe uma empresa com este CNPJ.');
    }
    const existingEmail = await this.empresasRepository.findOne({ where: { email: createEmpresaDto.email } });
    if (existingEmail) {
      throw new ConflictException('Já existe uma empresa com este e-mail.');
    }
    if (createEmpresaDto.sigla) {
      const existingSigla = await this.empresasRepository.findOne({ where: { sigla: createEmpresaDto.sigla } });
      if (existingSigla) {
        throw new ConflictException('Já existe uma empresa com esta sigla.');
      }
    }

    const newEmpresa = this.empresasRepository.create(createEmpresaDto);
    return this.empresasRepository.save(newEmpresa);
  }

  async createWithQueryRunner(createEmpresaDto: CreateEmpresaDto, queryRunner: QueryRunner): Promise<Empresas> {
    const repository = queryRunner.manager.getRepository(Empresas); // Usa o repositório da transação

    const existingRazaoSocial = await repository.findOne({ where: { razaoSocial: createEmpresaDto.razaoSocial } });
    if (existingRazaoSocial) {
      throw new ConflictException('Já existe uma empresa com esta razão social.');
    }
    const existingCnpj = await repository.findOne({ where: { cnpj: createEmpresaDto.cnpj } });
    if (existingCnpj) {
      throw new ConflictException('Já existe uma empresa com este CNPJ.');
    }
    const existingEmail = await repository.findOne({ where: { email: createEmpresaDto.email } });
    if (existingEmail) { // Adicionado validação de e-mail da empresa
        throw new ConflictException('Já existe uma empresa com este e-mail.');
    }
    if (createEmpresaDto.sigla) {
      const existingSigla = await repository.findOne({ where: { sigla: createEmpresaDto.sigla } });
      if (existingSigla) {
        throw new ConflictException('Já existe uma empresa com esta sigla.');
      }
    }

    const newEmpresa = repository.create(createEmpresaDto); // Usa o repositório da transação
    return repository.save(newEmpresa); // Usa o repositório da transação
  }

  async findOneById(id: string): Promise<Empresas | undefined> {
    return this.empresasRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Empresas[]> {
    return this.empresasRepository.find();
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<Empresas> {
    const empresa = await this.findOneById(id);
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada.');
    }
    Object.assign(empresa, updateEmpresaDto);
    return this.empresasRepository.save(empresa);
  }

  async remove(id: string): Promise<void> {
    const result = await this.empresasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Empresa não encontrada para remoção.');
    }
  }
}