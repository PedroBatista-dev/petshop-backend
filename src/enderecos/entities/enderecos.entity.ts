// src/enderecos/entities/enderecos.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresas } from '../../empresas/entities/empresas.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Municipio } from '../../municipio/entities/municipio.entity';
import { Pais } from '../../pais/entities/pais.entity';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; // Importe

export enum TipoEndereco {
  RESIDENCIAL = 'Residencial',
  COMERCIAL = 'Comercial'
}

export enum PrincipalEndereco {
  SIM = 'S',
  NAO = 'N'
}

@Entity('enderecos')
export class Enderecos extends BaseEntityAuditoria { // Herda da classe base
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
  codigoPaisId: string; // CodigoPais (obrigatório)

  @ManyToOne(() => Pais, pais => pais.enderecos, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'codigoPaisId' })
  pais: Pais;

  @Column()
  codigoMunicipioId: string; // CodigoMunicipio (obrigatório)

  @ManyToOne(() => Municipio, municipio => municipio.enderecos, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'codigoMunicipioId' })
  municipio: Municipio;

  @Column({ nullable: true })
  codigoEmpresaId: string; // CodigoEmpresa

  @ManyToOne(() => Empresas, empresa => empresa.enderecos, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'codigoEmpresaId' })
  empresa: Empresas;

  @Column({ nullable: true })
  codigoUsuarioId: string; // CodigoUsuario

  @ManyToOne(() => Usuario, usuario => usuario.enderecos, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'codigoUsuarioId' })
  usuario: Usuario;
}