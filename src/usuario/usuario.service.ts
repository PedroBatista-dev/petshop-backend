// src/usuario/usuario.service.ts
import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { EstadoCivil, Sexo, Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CargoService } from '../cargo/cargo.service';
import { EmpresasService } from '../empresas/empresas.service';

import * as moment from 'moment';
import { Empresas } from '../empresas/entities/empresas.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private cargoService: CargoService,
    private empresasService: EmpresasService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existingUserByEmail = await this.usuariosRepository.findOne({ where: { email: createUsuarioDto.email } });
    if (existingUserByEmail) {
      throw new ConflictException('Este e-mail já está em uso.');
    }
    const existingUserByCpf = await this.usuariosRepository.findOne({ where: { cpf: createUsuarioDto.cpf } });
    if (existingUserByCpf) {
      throw new ConflictException('Este CPF já está em uso.');
    }
    const empresa = await this.empresasService.findOneById(createUsuarioDto.codigoEmpresaId);
    if (!empresa) {
      throw new NotFoundException('Empresa para o cliente não encontrada.');
    }
    const cargo = await this.cargoService.findOneById(createUsuarioDto.codigoCargoId);
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    const newUsuario = this.usuariosRepository.create(createUsuarioDto);
    newUsuario.passwordHash = await Usuario.hashPassword(createUsuarioDto.password);
    newUsuario.dataNascimento = moment(createUsuarioDto.dataNascimento, 'YYYY-MM-DD').toDate();

    return this.usuariosRepository.save(newUsuario);
  }
  
  async createAdmin(empresa: Empresas, cargoId: string, email: string, generatedPassword: string, empresaCreatedAt: Date, queryRunner: QueryRunner): Promise<Usuario> {
    const repository = queryRunner.manager.getRepository(Usuario);
    
    if (!empresa) {
      throw new NotFoundException('Erro ao criar Empresa.');
    }

    const existingUserByEmail = await repository.findOne({ where: { email: email } }); // Usa repositório da transação
    if (existingUserByEmail) {
      throw new ConflictException('Este e-mail já está em uso para outro usuário.');
    }

    const cargo = await this.cargoService.findOneById(cargoId); // OK para não usar queryRunner aqui
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    const userAdminDto: CreateUsuarioDto = {
      nomeCompleto: `Admin ${empresa.razaoSocial}`, // Nome mais descritivo
      cpf: '00000000000', // Gerar CPF placeholder
      dataNascimento: moment(empresaCreatedAt).format('YYYY-MM-DD'), // Data de nascimento padrão
      sexo: Sexo.OUTRO, // Sexo padrão
      estadoCivil: EstadoCivil.SOLTEIRO, // Estado civil padrão
      telefone: '00000000000', // Telefone padrão
      email: email, // Email da empresa
      password: generatedPassword, // Senha gerada
      codigoCargoId: cargoId,
      codigoEmpresaId: empresa.id,
    };

    const newUsuario = repository.create(userAdminDto);
    newUsuario.passwordHash = await Usuario.hashPassword(userAdminDto.password);
    newUsuario.dataNascimento = moment(userAdminDto.dataNascimento, 'YYYY-MM-DD').toDate();

    return repository.save(newUsuario);
  }

  async findOneByEmail(email: string): Promise<Usuario | undefined> {
    return this.usuariosRepository.findOne({ where: { email }, relations: ['cargo', 'empresa'] });
  }

  async findOneById(id: string): Promise<Usuario | undefined> {
    return this.usuariosRepository.findOne({ where: { id }, relations: ['cargo', 'empresa'] });
  }

  async findAll(codigoEmpresaId?: string): Promise<Usuario[]> {
    if (codigoEmpresaId) {
      return this.usuariosRepository.find({ where: { codigoEmpresaId }, relations: ['cargo', 'empresa'] });
    }
    return this.usuariosRepository.find({ relations: ['cargo', 'empresa'] });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (updateUsuarioDto.password) {
      usuario.passwordHash = await Usuario.hashPassword(updateUsuarioDto.password);
      delete updateUsuarioDto.password; // Evita armazenar a senha em texto claro
    }

    // Impede a atualização direta de campos sensíveis através deste método de atualização genérico
    // que devem ser controlados por lógica de negócios específica ou endpoints de admin.
    delete updateUsuarioDto.codigoCargoId;
    delete updateUsuarioDto.codigoEmpresaId;
    delete updateUsuarioDto.email;
    delete updateUsuarioDto.cpf;

    if (updateUsuarioDto.dataNascimento) {
      usuario.dataNascimento = new Date(updateUsuarioDto.dataNascimento);
      delete updateUsuarioDto.dataNascimento;
    }

    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usuariosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado para remoção.');
    }
  }

  // Métodos para recuperação de senha (usados pelo AuthService)
  async updateResetToken(usuarioId: string, token: string | null, expires: Date | null): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    usuario.resetPasswordToken = token;
    usuario.resetPasswordExpires = expires;
    return this.usuariosRepository.save(usuario);
  }

  async findByResetToken(token: string): Promise<Usuario | undefined> {
    return this.usuariosRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
  }
}