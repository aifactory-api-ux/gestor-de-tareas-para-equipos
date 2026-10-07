import { useState, useCallback } from 'react';
import type { Tarea, TareaCreatePayload, TareaUpdatePayload, EstadoTarea, PrioridadTarea } from '../types/models';
import { tareaService } from '../services/tarea.service';

export function useTareas(filtros?: { estado?: EstadoTarea; prioridad?: PrioridadTarea }) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTareas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tareaService.getTareas(filtros);
      const tareasConVencimiento = response.tareas.map((tarea) => ({
        ...tarea,
        isOverdue: new Date(tarea.fecha_limite) < new Date() && tarea.estado !== 'terminada',
      }));
      setTareas(tareasConVencimiento);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [filtros?.estado, filtros?.prioridad]);

  const createTarea = useCallback(async (data: TareaCreatePayload): Promise<Tarea> => {
    const tarea = await tareaService.createTarea(data);
    setTareas((prev) => [...prev, { ...tarea, isOverdue: new Date(tarea.fecha_limite) < new Date() }]);
    return tarea;
  }, []);

  const updateTarea = useCallback(async (id: string, data: TareaUpdatePayload): Promise<Tarea> => {
    const tareaActualizada = await tareaService.updateTarea(id, data);
    setTareas((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...tareaActualizada, isOverdue: new Date(tareaActualizada.fecha_limite) < new Date() && tareaActualizada.estado !== 'terminada' }
          : t
      )
    );
    return tareaActualizada;
  }, []);

  const deleteTarea = useCallback(async (id: string): Promise<void> => {
    await tareaService.deleteTarea(id);
    setTareas((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    tareas,
    loading,
    error,
    fetchTareas,
    createTarea,
    updateTarea,
    deleteTarea,
  };
}