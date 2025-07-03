// src/cargo/cargo.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { Cargo } from './entities/cargo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cargo]), forwardRef(() => AuthModule)],
  controllers: [CargoController],
  providers: [CargoService],
  exports: [CargoService],
})
export class CargoModule {}