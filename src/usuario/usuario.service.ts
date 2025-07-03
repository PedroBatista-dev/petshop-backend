// src/usuario/usuario.service.ts
import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CargoService } from '../cargo/cargo.service';
import { EmpresasService } from '../empresas/empresas.service';

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

    const cargo = await this.cargoService.findOneById(createUsuarioDto.codigoCargoId);
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    // Lógica de negócios para associação de empresa com base no cargo
    const cargoDescricao = cargo.descricao.toLowerCase();

    if (cargoDescricao === 'dono_master') {
      if (createUsuarioDto.codigoEmpresaId) {
        throw new BadRequestException('Um DONO_MASTER não pode estar vinculado a uma empresa.');
      }
      const existingMaster = await this.usuariosRepository.findOne({
        where: { codigoCargoId: cargo.id },
      });
      if (existingMaster) {
        throw new ConflictException('Já existe um DONO_MASTER no sistema. Não é permitido criar mais de um.');
      }
    } else if (cargoDescricao !== 'cliente') { // Dono_Empresa, Gerente, Funcionario DEVEM ter uma empresa
      if (!createUsuarioDto.codigoEmpresaId) {
        throw new BadRequestException(`Usuários com o cargo '${cargo.descricao}' devem ter um Código da Empresa.`);
      }
      const empresa = await this.empresasService.findOneById(createUsuarioDto.codigoEmpresaId);
      if (!empresa) {
        throw new NotFoundException('Empresa não encontrada.');
      }
      // Regra específica: apenas um 'Dono Empresa' por empresa
      if (cargoDescricao === 'dono empresa') {
        const existingDonoEmpresa = await this.usuariosRepository.findOne({
          where: { codigoCargoId: cargo.id, codigoEmpresaId: createUsuarioDto.codigoEmpresaId },
        });
        if (existingDonoEmpresa) {
          throw new ConflictException(`Já existe um 'Dono Empresa' para a empresa com ID ${createUsuarioDto.codigoEmpresaId}.`);
        }
      }
    } else { // 'Cliente' pode opcionalmente ter uma empresa ou ser avulso
      if (createUsuarioDto.codigoEmpresaId) {
        const empresa = await this.empresasService.findOneById(createUsuarioDto.codigoEmpresaId);
        if (!empresa) {
          throw new NotFoundException('Empresa para o cliente não encontrada.');
        }
      }
    }

    const newUsuario = this.usuariosRepository.create(createUsuarioDto);
    newUsuario.passwordHash = await Usuario.hashPassword(createUsuarioDto.password);
    newUsuario.dataNascimento = new Date(createUsuarioDto.dataNascimento); // Converte a string da data para objeto Date

    return this.usuariosRepository.save(newUsuario);
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