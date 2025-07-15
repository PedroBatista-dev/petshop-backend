// src/enderecos/enderecos.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Endereco, PrincipalEndereco } from './entities/endereco.entity';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { PaisesService } from '../pais/paises.service';
import { MunicipiosService } from '../municipios/municipios.service';
import { EmpresasService } from '../empresas/empresas.service';
import { UsuariosService } from '../usuario/usuarios.service';

@Injectable()
export class EnderecosService {
  constructor(
    @InjectRepository(Endereco)
    private enderecosRepository: Repository<Endereco>,
    private paisService: PaisesService,
    private municipioService: MunicipiosService,
    private empresasService: EmpresasService,
    private usuarioService: UsuariosService,
  ) {}

  async create(
    createEnderecoDto: CreateEnderecoDto,
    idEmpresa: string,
  ): Promise<Endereco> {
    if (createEnderecoDto.idEmpresa && createEnderecoDto.idUsuario) {
      throw new BadRequestException(
        'Um endereço deve ser associado a uma empresa OU a um usuário, não a ambos.',
      );
    }
    if (!createEnderecoDto.idEmpresa && !createEnderecoDto.idUsuario) {
      throw new BadRequestException(
        'Um endereço deve ser associado a uma empresa OU a um usuário.',
      );
    }

    const pais = await this.paisService.findOneById(
      createEnderecoDto.idPais,
      idEmpresa,
    );
    if (!pais) {
      throw new NotFoundException('País não encontrado.');
    }
    const municipio = await this.municipioService.findOneById(
      createEnderecoDto.idMunicipio,
      idEmpresa,
    );
    if (!municipio) {
      throw new NotFoundException('Município não encontrado.');
    }

    if (createEnderecoDto.idEmpresa) {
      const empresa = await this.empresasService.findOneById(
        createEnderecoDto.idEmpresa,
      );
      if (!empresa) {
        throw new NotFoundException('Empresa não encontrada.');
      }
    }

    if (createEnderecoDto.idUsuario) {
      const usuario = await this.usuarioService.findOneById(
        createEnderecoDto.idUsuario,
        idEmpresa,
      );
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado.');
      }
    }

    if (createEnderecoDto.principal === PrincipalEndereco.SIM) {
      if (createEnderecoDto.idEmpresa) {
        const existingPrincipal = await this.enderecosRepository.findOne({
          where: {
            idEmpresa: createEnderecoDto.idEmpresa,
            principal: PrincipalEndereco.SIM,
          },
        });
        if (existingPrincipal) {
          throw new ConflictException(
            'Já existe um endereço principal para esta empresa. Defina o endereço existente como não principal primeiro.',
          );
        }
      } else if (createEnderecoDto.idUsuario) {
        const existingPrincipal = await this.enderecosRepository.findOne({
          where: {
            idUsuario: createEnderecoDto.idUsuario,
            principal: PrincipalEndereco.SIM,
          },
        });
        if (existingPrincipal) {
          throw new ConflictException(
            'Já existe um endereço principal para este usuário. Defina o endereço existente como não principal primeiro.',
          );
        }
      }
    }

    const newEndereco = this.enderecosRepository.create(createEnderecoDto);
    return this.enderecosRepository.save(newEndereco);
  }

  async findAllForCompany(idEmpresa: string): Promise<Endereco[]> {
    return this.enderecosRepository.find({
      where: { idEmpresa },
      relations: ['pais', 'municipio', 'empresa', 'usuario'],
    });
  }

  async findAllForUser(idUsuario: string): Promise<Endereco[]> {
    return this.enderecosRepository.find({
      where: { idUsuario },
      relations: ['pais', 'municipio', 'empresa', 'usuario'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.enderecosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Endereço não encontrado para remoção.');
    }
  }
}
