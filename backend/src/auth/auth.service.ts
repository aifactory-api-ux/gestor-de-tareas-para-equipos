import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { RolUsuario } from '../usuario/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existente = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existente) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(registerDto.password, saltRounds);

    const usuario = this.usuarioRepository.create({
      nombre: registerDto.nombre,
      email: registerDto.email,
      password_hash,
      rol: RolUsuario.MEMBER,
      activo: true,
    });

    const guardado = await this.usuarioRepository.save(usuario);

    const { password_hash: _, ...usuarioResponse } = guardado;

    return usuarioResponse;
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(loginDto.password, usuario.password_hash);

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const access_token = this.jwtService.sign(payload);

    const { password_hash: _, ...usuarioResponse } = usuario;

    return {
      access_token,
      usuario: usuarioResponse,
    };
  }
}
