// src/enderecos/entities/enderecos.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Municipio } from '../../municipios/entities/municipio.entity';
import { Pais } from '../../pais/entities/pais.entity';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; // Importe
import { Empresa } from '../../empresas/entities/empresa.entity';

export enum TipoEndereco {
  RESIDENCIAL = 'Residencial',
  COMERCIAL = 'Comercial',
}

export enum PrincipalEndereco {
  SIM = 'S',
  NAO = 'N',
}

@Entity('enderecos')
export class Endereco extends BaseEntityAuditoria {
  // Herda da classe base
  @Column({ type: 'enum', enum: PrincipalEndereco })
  principal: PrincipalEndereco; // Principal (obrigatório, S ou N)

  @Column({ type: 'enum', enum: TipoEndereco })
  tipo: TipoEndereco; // Tipo (obrigatório, Residencial ou Comercial)

  @Column()
  cep: string; // Cep (obrigatório)

  @Column()
  logradouro: string; // Logradouro (obrigatório)

  @Column()
  numero: string; // Numero (obrigatório)

  @Column({ nullable: true })
  complemento: string; // Complemento

  @Column()
  bairro: string; // Bairro (obrigatório)

  @Column()
  idPais: string; // CodigoPais (obrigatório)

  @ManyToOne(() => Pais, (pais) => pais.enderecos, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idPais' })
  pais: Pais;

  @Column()
  idMunicipio: string; // CodigoMunicipio (obrigatório)

  @ManyToOne(() => Municipio, (municipio) => municipio.enderecos, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'idMunicipio' })
  municipio: Municipio;

  @Column({ nullable: true })
  idEmpresa: string; // idEmpresa

  @ManyToOne(() => Empresa, (empresa) => empresa.enderecos, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;

  @Column({ nullable: true })
  idUsuario: string; // CodigoUsuario

  @ManyToOne(() => Usuario, (usuario) => usuario.enderecos, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
