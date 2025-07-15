// src/contatos/contatos.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contato, Principal } from './entities/contato.entity';
import { CreateContatoDto } from './dto/create-contato.dto';
import { EmpresasService } from '../empresas/empresas.service';
import { UsuariosService } from '../usuario/usuarios.service';

@Injectable()
export class ContatosService {
  constructor(
    @InjectRepository(Contato)
    private contatosRepository: Repository<Contato>,
    private empresasService: EmpresasService,
    private usuarioService: UsuariosService,
  ) {}

  async create(
    createContatoDto: CreateContatoDto,
    idEmpresa: string,
  ): Promise<Contato> {
    if (createContatoDto.idEmpresa && createContatoDto.idUsuario) {
      throw new BadRequestException(
        'Um contato deve ser associado a uma empresa OU a um usuário, não a ambos.',
      );
    }
    if (!createContatoDto.idEmpresa && !createContatoDto.idUsuario) {
      throw new BadRequestException(
        'Um contato deve ser associado a uma empresa OU a um usuário.',
      );
    }

    if (createContatoDto.idEmpresa) {
      const empresa = await this.empresasService.findOneById(
        createContatoDto.idEmpresa,
      );
      if (!empresa) {
        throw new NotFoundException('Empresa não encontrada.');
      }
    }

    if (createContatoDto.idUsuario) {
      const usuario = await this.usuarioService.findOneById(
        createContatoDto.idUsuario,
        idEmpresa,
      );
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado.');
      }
    }

    if (createContatoDto.principal === Principal.SIM) {
      if (createContatoDto.idEmpresa) {
        const existingPrincipal = await this.contatosRepository.findOne({
          where: {
            idEmpresa: createContatoDto.idEmpresa,
            principal: Principal.SIM,
          },
        });
        if (existingPrincipal) {
          throw new ConflictException(
            'Já existe um contato principal para esta empresa. Defina o contato existente como não principal primeiro.',
          );
        }
      } else if (createContatoDto.idUsuario) {
        const existingPrincipal = await this.contatosRepository.findOne({
          where: {
            idUsuario: createContatoDto.idUsuario,
            principal: Principal.SIM,
          },
        });
        if (existingPrincipal) {
          throw new ConflictException(
            'Já existe um contato principal para este usuário. Defina o contato existente como não principal primeiro.',
          );
        }
      }
    }

    const novoContato = this.contatosRepository.create(createContatoDto);
    return this.contatosRepository.save(novoContato);
  }

  async findAllForCompany(idEmpresa: string): Promise<Contato[]> {
    return this.contatosRepository.find({
      where: { idEmpresa },
      relations: ['empresa', 'usuario'],
    });
  }

  async findAllForUser(idUsuario: string): Promise<Contato[]> {
    return this.contatosRepository.find({
      where: { idUsuario },
      relations: ['empresa', 'usuario'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.contatosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contato não encontrado para remoção.');
    }
  }
}
