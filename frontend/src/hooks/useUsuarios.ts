import { useState, useCallback } from 'react';
import type { Usuario } from '../types/models';
import { usuarioService } from '../services/usuario.service';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usuariosData = await usuarioService.getUsuarios();
      setUsuarios(usuariosData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRol = useCallback(async (id: string, rol: 'admin' | 'member') => {
    setLoading(true);
    setError(null);
    try {
      const usuarioActualizado = await usuarioService.updateRol(id, rol);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? usuarioActualizado : u))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el rol');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await usuarioService.deactivateUser(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al desactivar el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    updateRol,
    deactivateUser,
  };
}
