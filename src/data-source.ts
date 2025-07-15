import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pedrobatista', // Substitua pelo seu nome de usuário do macOS
  password: 'pedro123', // Deixe vazio se não definiu senha para o PostgreSQL
  database: 'petshop_db', // O nome do banco de dados que você criou no DBeaver
  synchronize: false,
  logging: true,
  entities: ['build/**/*.entity.js'], // Caminho para suas entidades compiladas
  migrations: ['build/migrations/*.js'], // Caminho para suas migrações compiladas
});
