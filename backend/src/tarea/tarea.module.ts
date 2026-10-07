import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { TareaController } from './tarea.controller';
import { TareaService } from './tarea.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Usuario]), AuthModule],
  controllers: [TareaController],
  providers: [TareaService],
  exports: [TareaService],
})
export class TareaModule {}