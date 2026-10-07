import { useState, useCallback } from 'react';
import type { Tarea } from '../types/models';
import { tareaService } from '../services/tarea.service';

export function useTareasVencidas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTareasVencidas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tareaService.getTareasVencidas();
      const tareasConVencimiento = response.tareas.map((tarea) => ({
        ...tarea,
        isOverdue: true,
      }));
      setTareas(tareasConVencimiento);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las tareas vencidas');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tareas,
    loading,
    error,
    fetchTareasVencidas,
  };
}
