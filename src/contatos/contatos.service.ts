// src/contatos/contatos.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contatos, Principal } from './entities/contatos.entity';
import { CreateContatoDto } from './dto/create-contato.dto';
import { UpdateContatoDto } from './dto/update-contato.dto'; // Importe
import { EmpresasService } from '../empresas/empresas.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class ContatosService {
  constructor(
    @InjectRepository(Contatos)
    private contatosRepository: Repository<Contatos>,
    private empresasService: EmpresasService,
    private usuarioService: UsuarioService,
  ) {}

  async create(createContatoDto: CreateContatoDto): Promise<Contatos> {
    if (createContatoDto.codigoEmpresaId && createContatoDto.codigoUsuarioId) {
      throw new BadRequestException('Um contato deve ser associado a uma empresa OU a um usuário, não a ambos.');
    }
    if (!createContatoDto.codigoEmpresaId && !createContatoDto.codigoUsuarioId) {
      throw new BadRequestException('Um contato deve ser associado a uma empresa OU a um usuário.');
    }

    if (createContatoDto.codigoEmpresaId) {
      const empresa = await this.empresasService.findOneById(createContatoDto.codigoEmpresaId);
      if (!empresa) {
        throw new NotFoundException('Empresa não encontrada.');
      }
    }

    if (createContatoDto.codigoUsuarioId) {
      const usuario = await this.usuarioService.findOneById(createContatoDto.codigoUsuarioId);
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado.');
      }
    }

    // Garante que haja apenas um contato "Principal" por empresa/usuário
    if (createContatoDto.principal === Principal.SIM) {
      if (createContatoDto.codigoEmpresaId) {
        const existingPrincipal = await this.contatosRepository.findOne({
          where: { codigoEmpresaId: createContatoDto.codigoEmpresaId, principal: Principal.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um contato principal para esta empresa. Defina o contato existente como não principal primeiro.');
        }
      } else if (createContatoDto.codigoUsuarioId) {
        const existingPrincipal = await this.contatosRepository.findOne({
          where: { codigoUsuarioId: createContatoDto.codigoUsuarioId, principal: Principal.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um contato principal para este usuário. Defina o contato existente como não principal primeiro.');
        }
      }
    }

    const newContato = this.contatosRepository.create(createContatoDto);
    return this.contatosRepository.save(newContato);
  }

  async findOneById(id: string): Promise<Contatos | undefined> {
    return this.contatosRepository.findOne({ where: { id }, relations: ['empresa', 'usuario'] });
  }

  async findAllForCompany(companyId: string): Promise<Contatos[]> {
    return this.contatosRepository.find({ where: { codigoEmpresaId: companyId }, relations: ['empresa', 'usuario'] });
  }

  async findAllForUser(usuarioId: string): Promise<Contatos[]> {
    return this.contatosRepository.find({ where: { codigoUsuarioId: usuarioId }, relations: ['empresa', 'usuario'] });
  }

  async update(id: string, updateContatoDto: UpdateContatoDto): Promise<Contatos> {
    const contato = await this.findOneById(id);
    if (!contato) {
      throw new NotFoundException('Contato não encontrado.');
    }
    // Lógica para garantir apenas um Principal, se o campo for atualizado para SIM
    if (updateContatoDto.principal === Principal.SIM && contato.principal === Principal.NAO) {
      if (contato.codigoEmpresaId) {
        const existingPrincipal = await this.contatosRepository.findOne({
          where: { codigoEmpresaId: contato.codigoEmpresaId, principal: Principal.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um contato principal para esta empresa. Defina o contato existente como não principal primeiro.');
        }
      } else if (contato.codigoUsuarioId) {
        const existingPrincipal = await this.contatosRepository.findOne({
          where: { codigoUsuarioId: contato.codigoUsuarioId, principal: Principal.SIM },
        });
        if (existingPrincipal) {
          throw new ConflictException('Já existe um contato principal para este usuário. Defina o contato existente como não principal primeiro.');
        }
      }
    }
    Object.assign(contato, updateContatoDto);
    return this.contatosRepository.save(contato);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contatosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contato não encontrado para remoção.');
    }
  }
}