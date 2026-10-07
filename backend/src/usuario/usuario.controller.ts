import { Controller, Get, Patch, Param, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateRolDto } from './dto/update-rol.dto';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Usuario } from './entities/usuario.entity';
import { RolUsuario } from './entities/usuario.entity';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  async listarUsuarios(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioService.findAll();
    return usuarios.map((u) => this.usuarioService.toResponseDto(u));
  }

  @Get('perfil')
  async obtenerPerfil(@CurrentUser() usuario: Usuario): Promise<UsuarioResponseDto> {
    return this.usuarioService.toResponseDto(usuario);
  }

  @Patch(':id/rol')
  async actualizarRol(
    @Param('id') id: string,
    @Body() updateRolDto: UpdateRolDto,
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioService.updateRol(id, updateRolDto.rol);
    return this.usuarioService.toResponseDto(usuario);
  }

  @Patch(':id/desactivar')
  async desactivarUsuario(@Param('id') id: string): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioService.deactivate(id);
    return this.usuarioService.toResponseDto(usuario);
  }
}
