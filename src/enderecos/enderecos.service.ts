// src/enderecos/enderecos.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enderecos, PrincipalEndereco } from './entities/enderecos.entity';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto'; // Importe
import { PaisService } from '../pais/pais.service';
import { MunicipioService } from '../municipio/municipio.service';
import { EmpresasService } from '../empresas/empresas.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class EnderecosService {
  constructor(
    @InjectRepository(Enderecos)
    private enderecosRepository: Repository<Enderecos>,
    private paisService: PaisService,
    private municipioService: MunicipioService,
    private empresasService: EmpresasService,
    private usuarioService: UsuarioService,
  ) {}

  async create(createEnderecoDto: CreateEnderecoDto): Promise<Enderecos> {
    if (createEnderecoDto.codigoEmpresaId && createEnderecoDto.codigoUsuarioId) {
      throw new BadRequestException('Um endereço deve ser associado a uma empresa OU a um usuário, não a ambos.');
    }
    if (!createEnderecoDto.codigoEmpresaId && !createEnderecoDto.codigoUsuarioId) {
      throw new BadRequestException('Um endereço deve ser associado a uma empresa OU a um usuário.');
    }

    const pais = await this.paisService.findOneById(createEnderecoDto.codigoPaisId);
    if (!pais) {
      throw new NotFoundException('País não encontrado.');
    }
    const municipio = await this.municipioService.findOneById(createEnderecoDto.codigoMunicipioId);
    if (!municipio) {
      throw new NotFoundException('Município não encontrado.');
    }

    if (createEnderecoDto.codigoEmpresaId) {
      const empresa = await this.empresasService.findOneById(createEnderecoDto.codigoEmpresaId);
      if (!empresa) {
        throw new NotFoundException('Empresa não encontrada.');
      }
    }

    if (createEnderecoDto.codigoUsuarioId) {
      const usuario = await this.usuarioService.findOneById(createEnderecoDto.codigoUsuarioId);
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado.');
      }
    }

    // Garante que haja apenas um endereço "Principal" por empresa/usuário
    if (createEnderecoDto.principal === PrincipalEndereco.SIM) {
      if (createEnderecoDto.codigoEmpresaId) {
        const existingPrincipal = await this.enderecosRepository.findOne({
          where: { codigoEmpresaId: createEnderecoDto.codigoEmpresaId, principal: PrincipalEndereco.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um endereço principal para esta empresa. Defina o endereço existente como não principal primeiro.');
        }
      } else if (createEnderecoDto.codigoUsuarioId) {
        const existingPrincipal = await this.enderecosRepository.findOne({
          where: { codigoUsuarioId: createEnderecoDto.codigoUsuarioId, principal: PrincipalEndereco.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um endereço principal para este usuário. Defina o endereço existente como não principal primeiro.');
        }
      }
    }

    const newEndereco = this.enderecosRepository.create(createEnderecoDto);
    return this.enderecosRepository.save(newEndereco);
  }

  async findOneById(id: string): Promise<Enderecos | undefined> {
    return this.enderecosRepository.findOne({ where: { id }, relations: ['pais', 'municipio', 'empresa', 'usuario'] });
  }

  async findAllForCompany(companyId: string): Promise<Enderecos[]> {
    return this.enderecosRepository.find({ where: { codigoEmpresaId: companyId }, relations: ['pais', 'municipio', 'empresa', 'usuario'] });
  }

  async findAllForUser(usuarioId: string): Promise<Enderecos[]> {
    return this.enderecosRepository.find({ where: { codigoUsuarioId: usuarioId }, relations: ['pais', 'municipio', 'empresa', 'usuario'] });
  }

  async update(id: string, updateEnderecoDto: UpdateEnderecoDto): Promise<Enderecos> {
    const endereco = await this.findOneById(id);
    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    // Lógica para garantir apenas um Principal, se o campo for atualizado para SIM
    if (updateEnderecoDto.principal === PrincipalEndereco.SIM && endereco.principal === PrincipalEndereco.NAO) {
      if (endereco.codigoEmpresaId) {
        const existingPrincipal = await this.enderecosRepository.findOne({
          where: { codigoEmpresaId: endereco.codigoEmpresaId, principal: PrincipalEndereco.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um endereço principal para esta empresa. Defina o endereço existente como não principal primeiro.');
        }
      } else if (endereco.codigoUsuarioId) {
        const existingPrincipal = await this.enderecosRepository.findOne({
          where: { codigoUsuarioId: endereco.codigoUsuarioId, principal: PrincipalEndereco.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um endereço principal para este usuário. Defina o endereço existente como não principal primeiro.');
        }
      }
    }

    Object.assign(endereco, updateEnderecoDto);
    return this.enderecosRepository.save(endereco);
  }

  async remove(id: string): Promise<void> {
    const result = await this.enderecosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Endereço não encontrado para remoção.');
    }
  }
}