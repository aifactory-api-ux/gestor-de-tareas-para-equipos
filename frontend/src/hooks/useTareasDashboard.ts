import { useState, useCallback } from 'react';
import { tareaService, DashboardData } from '../services/tarea.service';

export function useTareasDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tareaService.getTareasDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
  };
}
