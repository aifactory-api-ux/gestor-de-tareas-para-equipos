import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Not, And } from 'typeorm';
import { Tarea, PrioridadTarea, EstadoTarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { TareaResponseDto, TareaListResponseDto, DashboardResponseDto } from './dto/tarea-response.dto';

@Injectable()
export class TareaService {
  private readonly prioridadOrden: Record<PrioridadTarea, number> = {
    [PrioridadTarea.ALTA]: 1,
    [PrioridadTarea.MEDIA]: 2,
    [PrioridadTarea.BAJA]: 3,
  };

  constructor(
    @InjectRepository(Tarea)
    private tareaRepository: Repository<Tarea>,
  ) {}

  async create(createTareaDto: CreateTareaDto, usuarioId: string): Promise<TareaResponseDto> {
    const tarea = this.tareaRepository.create({
      ...createTareaDto,
      usuario_id: usuarioId,
      estado: EstadoTarea.PENDIENTE,
    });

    const saved = await this.tareaRepository.save(tarea);
    return TareaResponseDto.fromEntity(saved);
  }

  async findAllByUsuario(
    usuarioId: string,
    filtros?: { estado?: EstadoTarea; prioridad?: PrioridadTarea },
  ): Promise<TareaListResponseDto> {
    const queryBuilder = this.tareaRepository
      .createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.usuario', 'usuario')
      .where('tarea.usuario_id = :usuarioId', { usuarioId });

    if (filtros?.estado) {
      queryBuilder.andWhere('tarea.estado = :estado', { estado: filtros.estado });
    }

    if (filtros?.prioridad) {
      queryBuilder.andWhere('tarea.prioridad = :prioridad', { prioridad: filtros.prioridad });
    }

    queryBuilder.orderBy('tarea.prioridad', 'ASC').addOrderBy('tarea.fecha_limite', 'ASC');

    const tareas = await queryBuilder.getMany();
    const respuestas = tareas.map((t) => TareaResponseDto.fromEntity(t));

    return new TareaListResponseDto(respuestas, respuestas.length);
  }

  async findVencidas(): Promise<TareaListResponseDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tareas = await this.tareaRepository
      .createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.usuario', 'usuario')
      .where('tarea.fecha_limite < :today', { today })
      .andWhere('tarea.estado != :estadoTerminada', { estadoTerminada: EstadoTarea.TERMINADA })
      .orderBy('tarea.fecha_limite', 'ASC')
      .getMany();

    const respuestas = tareas.map((t) => TareaResponseDto.fromEntity(t));

    return new TareaListResponseDto(respuestas, respuestas.length);
  }

  async getDashboard(): Promise<DashboardResponseDto> {
    const pendientes = await this.tareaRepository.count({
      where: { estado: EstadoTarea.PENDIENTE },
    });

    const en_curso = await this.tareaRepository.count({
      where: { estado: EstadoTarea.EN_CURSO },
    });

    const terminadas = await this.tareaRepository.count({
      where: { estado: EstadoTarea.TERMINADA },
    });

    return new DashboardResponseDto(pendientes, en_curso, terminadas);
  }

  async findOne(id: string, usuarioId: string): Promise<TareaResponseDto> {
    const tarea = await this.tareaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (tarea.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acceso denegado');
    }

    return TareaResponseDto.fromEntity(tarea);
  }

  async update(
    id: string,
    updateTareaDto: UpdateTareaDto,
    usuarioId: string,
  ): Promise<TareaResponseDto> {
    const tarea = await this.tareaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (tarea.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acceso denegado');
    }

    Object.assign(tarea, updateTareaDto);

    const updated = await this.tareaRepository.save(tarea);
    return TareaResponseDto.fromEntity(updated);
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    const tarea = await this.tareaRepository.findOne({
      where: { id },
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (tarea.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acceso denegado');
    }

    await this.tareaRepository.remove(tarea);
  }
}