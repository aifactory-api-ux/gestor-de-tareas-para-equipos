import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { RolUsuario } from './entities/usuario.entity';
import { UsuarioResponseDto } from './dto/usuario-response.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      order: { fecha_creacion: 'ASC' },
    });
  }

  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }

  async updateRol(id: string, rol: RolUsuario): Promise<Usuario> {
    const usuario = await this.findById(id);
    usuario.rol = rol;
    return this.usuarioRepository.save(usuario);
  }

  async deactivate(id: string): Promise<Usuario> {
    const usuario = await this.findById(id);
    usuario.activo = false;
    return this.usuarioRepository.save(usuario);
  }

  async activate(id: string): Promise<Usuario> {
    const usuario = await this.findById(id);
    usuario.activo = true;
    return this.usuarioRepository.save(usuario);
  }

  async updatePassword(id: string, newPassword: string): Promise<Usuario> {
    const usuario = await this.findById(id);
    const saltRounds = 10;
    usuario.password_hash = await bcrypt.hash(newPassword, saltRounds);
    return this.usuarioRepository.save(usuario);
  }

  toResponseDto(usuario: Usuario): UsuarioResponseDto {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      fecha_creacion: usuario.fecha_creacion,
      fecha_actualizacion: usuario.fecha_actualizacion,
    };
  }
}
