import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TareaService } from './tarea.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Usuario, PrioridadTarea, EstadoTarea } from './entities/tarea.entity';
import { TareaResponseDto, TareaListResponseDto, DashboardResponseDto } from './dto/tarea-response.dto';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTareaDto: CreateTareaDto,
    @CurrentUser() user: Usuario,
  ): Promise<TareaResponseDto> {
    return this.tareaService.create(createTareaDto, user.id);
  }

  @Get()
  async findAll(
    @CurrentUser() user: Usuario,
    @Query('estado') estado?: EstadoTarea,
    @Query('prioridad') prioridad?: PrioridadTarea,
  ): Promise<TareaListResponseDto> {
    return this.tareaService.findAllByUsuario(user.id, { estado, prioridad });
  }

  @Get('vencidas')
  async findVencidas(): Promise<TareaListResponseDto> {
    return this.tareaService.findVencidas();
  }

  @Get('dashboard')
  async getDashboard(): Promise<DashboardResponseDto> {
    return this.tareaService.getDashboard();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: Usuario): Promise<TareaResponseDto> {
    return this.tareaService.findOne(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTareaDto: UpdateTareaDto,
    @CurrentUser() user: Usuario,
  ): Promise<TareaResponseDto> {
    return this.tareaService.update(id, updateTareaDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: Usuario): Promise<void> {
    return this.tareaService.remove(id, user.id);
  }
}