import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuthContext } from '../context/AuthContext';
import FormField from '../components/ui/FormField';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { tareaService } from '../services/tarea.service';
import type { PrioridadTarea } from '../types/models';

export default function CrearTareaPage() {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuthContext();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<PrioridadTarea | ''>('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    if (!prioridad) {
      setError('La prioridad es obligatoria');
      return;
    }

    if (!fechaLimite) {
      setError('La fecha límite es obligatoria');
      return;
    }

    const selectedDate = new Date(fechaLimite);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('La fecha límite debe ser futura');
      return;
    }

    setIsSubmitting(true);
    try {
      await tareaService.createTarea({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        prioridad,
        fecha_limite: fechaLimite,
      });
      navigate('/mis-tareas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: tokens.colors.neutrals.canvas
      }}>
        <p style={{ color: tokens.colors.neutrals.text_secondary }}>Cargando...</p>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.neutrals.canvas,
    padding: tokens.spacing.lg,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.h1.size,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.neutrals.text_primary,
    marginBottom: tokens.spacing.xl,
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.lg,
  };

  const errorStyle: React.CSSProperties = {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.semantic.danger_bg,
    border: `1px solid ${tokens.colors.semantic.danger_border}`,
    borderRadius: tokens.radii.md,
    color: tokens.colors.semantic.danger,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
  };

  const prioridadOptions = [
    { value: '', label: 'Selecciona una prioridad' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' },
  ];

  return (
    <div style={containerStyle}>
      <Card padding="lg">
        <h1 style={titleStyle}>Crear tarea</h1>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <FormField
            label="Título"
            name="titulo"
            type="text"
            placeholder="Título de la tarea"
            value={titulo}
            onChange={setTitulo}
            required
          />

          <FormField
            label="Descripción"
            name="descripcion"
            type="textarea"
            placeholder="Descripción de la tarea"
            value={descripcion}
            onChange={setDescripcion}
            required
          />

          <Select
            label="Prioridad"
            name="prioridad"
            options={prioridadOptions}
            value={prioridad}
            onChange={(val) => setPrioridad(val as PrioridadTarea)}
            required
          />

          <FormField
            label="Fecha límite"
            name="fechaLimite"
            type="text"
            placeholder="YYYY-MM-DD"
            value={fechaLimite}
            onChange={(val) => {
              const cleaned = val.replace(/[^\d-]/g, '');
              setFechaLimite(cleaned);
            }}
            required
          />

          <div style={{
            fontFamily: tokens.typography.font_family,
            fontSize: tokens.typography.sizes.small.size,
            color: tokens.colors.neutrals.text_tertiary,
            marginTop: `-${tokens.spacing.sm}`
          }}>
            Formato: YYYY-MM-DD. La fecha debe ser igual o mayor a hoy.
          </div>

          <div style={{ display: 'flex', gap: tokens.spacing.md, marginTop: tokens.spacing.md }}>
            <Button
              label={isSubmitting ? 'Creando...' : 'Crear tarea'}
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              onClick={() => {}}
            />
            <Button
              label="Cancelar"
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate('/mis-tareas')}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}
