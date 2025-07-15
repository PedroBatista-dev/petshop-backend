import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { EstadoCivil, Sexo, Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CargosService } from '../cargos/cargos.service';
import { EmpresasService } from '../empresas/empresas.service';

import * as moment from 'moment';
import { Empresa } from '../empresas/entities/empresa.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private cargoService: CargosService,
    private empresasService: EmpresasService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const empresa = await this.empresasService.findOneById(
      createUsuarioDto.idEmpresa,
    );
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada.');
    }
    const existingUserByEmail = await this.usuariosRepository.findOne({
      where: {
        email: createUsuarioDto.email,
        idEmpresa: createUsuarioDto.idEmpresa,
      },
    });
    if (existingUserByEmail) {
      throw new ConflictException('Este e-mail já está em uso.');
    }
    const existingUserByCpf = await this.usuariosRepository.findOne({
      where: {
        cpf: createUsuarioDto.cpf,
        idEmpresa: createUsuarioDto.idEmpresa,
      },
    });
    if (existingUserByCpf) {
      throw new ConflictException('Este CPF já está em uso.');
    }
    const cargo = await this.cargoService.findOneById(
      createUsuarioDto.idCargo,
      createUsuarioDto.idEmpresa,
    );
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    const novoUsuario = this.usuariosRepository.create(createUsuarioDto);
    novoUsuario.passwordHash = await Usuario.hashPassword(
      createUsuarioDto.password,
    );
    novoUsuario.dataNascimento = moment(
      createUsuarioDto.dataNascimento,
      'YYYY-MM-DD',
    ).toDate();

    return this.usuariosRepository.save(novoUsuario);
  }

  async createAdmin(
    empresa: Empresa,
    cargoId: string,
    email: string,
    generatedPassword: string,
    empresaCreatedAt: Date,
    queryRunner: QueryRunner,
  ): Promise<Usuario> {
    const repository = queryRunner.manager.getRepository(Usuario);

    if (!empresa) {
      throw new NotFoundException(
        'Erro ao criar usuário. Empresa não encontrada!',
      );
    }

    const existingUserByEmail = await repository.findOne({
      where: { email: email },
    });
    if (existingUserByEmail) {
      throw new ConflictException(
        'Este e-mail já está em uso para outro usuário.',
      );
    }

    const cargo = await this.cargoService.findOneById(cargoId);
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    const userAdminDto: CreateUsuarioDto = {
      nomeCompleto: `Admin ${empresa.razaoSocial}`,
      cpf: '00000000000',
      dataNascimento: moment(empresaCreatedAt).format('YYYY-MM-DD'),
      sexo: Sexo.OUTRO,
      estadoCivil: EstadoCivil.SOLTEIRO,
      telefone: '00000000000',
      email: email,
      password: generatedPassword,
      idCargo: cargoId,
      idEmpresa: empresa.id,
    };

    const newUsuario = repository.create(userAdminDto);
    newUsuario.passwordHash = await Usuario.hashPassword(userAdminDto.password);
    newUsuario.dataNascimento = moment(
      userAdminDto.dataNascimento,
      'YYYY-MM-DD',
    ).toDate();

    return repository.save(newUsuario);
  }

  async findOneByEmail(
    email: string,
    idEmpresa?: string,
  ): Promise<Usuario | undefined> {
    if (idEmpresa) {
      return this.usuariosRepository.findOne({
        where: { email, idEmpresa },
        relations: ['cargo', 'empresa'],
      });
    }

    return this.usuariosRepository.findOne({
      where: { email },
      relations: ['cargo', 'empresa'],
    });
  }

  async findOneById(
    id: string,
    idEmpresa: string,
  ): Promise<Usuario | undefined> {
    return this.usuariosRepository.findOne({
      where: { id, idEmpresa },
      relations: ['cargo', 'empresa'],
    });
  }

  async findAll(idEmpresa: string): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      where: { idEmpresa },
      relations: ['cargo', 'empresa'],
    });
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
    idEmpresa: string,
  ): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id, idEmpresa },
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    usuario.passwordHash = await Usuario.hashPassword(
      updateUsuarioDto.password,
    );
    usuario.dataNascimento = moment(
      updateUsuarioDto.dataNascimento,
      'YYYY-MM-DD',
    ).toDate();

    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usuariosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado para remoção.');
    }
  }

  async updateResetToken(
    usuarioId: string,
    token: string | null,
    expires: Date | null,
  ): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
    });
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
