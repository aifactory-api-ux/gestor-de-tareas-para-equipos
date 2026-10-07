# UI/UX Design Contract

> **READ THIS FILE BEFORE IMPLEMENTING ANY FRONTEND COMPONENT.**
> This is the single source of truth for all visual and functional requirements.

## Figma Source

File URL: https://www.figma.com/design/6r6r5cR6rMZleGrRUUOCl8

## Visual Direction

Interfaz web para gestión de tareas con dirección visual neutra, moderna y limpia. Se utiliza un lienzo gris muy claro, superficies blancas, bordes finos y sombras suaves para mantener claridad y baja densidad visual. Los acentos de color se reservan para comunicar urgencia, prioridad y estado: azul para acciones e información primaria, ámbar para prioridad media, rojo para vencimiento/alta prioridad y verde para tareas terminadas. La tipografía sans-serif de alta legibilidad, los espacios generosos y las tarjetas con jerarquía clara permiten que un miembro del equipo entienda el estado de las tareas de un vistazo.

## Pages / Figma Frames

### 1. Inicio de sesión
- **purpose**: Pantalla de autenticación para usuarios existentes.
- **sections**: ['Marca del producto', 'Formulario de acceso', 'Validación de credenciales', 'Enlace a registro']

### 2. Registro
- **purpose**: Pantalla de creación de cuenta para nuevos miembros.
- **sections**: ['Marca del producto', 'Formulario de registro', 'Requisitos de contraseña', 'Enlace a inicio de sesión']

### 3. Resumen de tareas
- **purpose**: Vista general del estado de las tareas del equipo.
- **sections**: ['Encabezado con saludo y fecha', 'Métricas de resumen', 'Tareas vencidas destacadas', 'Tareas recientes o próximas a vencer', 'Filtros rápidos']

### 4. Mis tareas
- **purpose**: Lista de tareas propias con acciones de actualización.
- **sections**: ['Encabezado con conteo', 'Filtros por estado y prioridad', 'Lista de tareas propias', 'Acciones de cambio de estado', 'Botón de nueva tarea']

### 5. Tareas vencidas del equipo
- **purpose**: Lista priorizada de tareas vencidas.
- **sections**: ['Alerta de tareas vencidas', 'Filtros por responsable y antigüedad', 'Lista de tareas vencidas', 'Acciones para actualizar responsable o fecha']

### 6. Creación de tareas
- **purpose**: Formulario para registrar una nueva tarea.
- **sections**: ['Encabezado del formulario', 'Datos de la tarea', 'Responsable y estado', 'Prioridad y fecha límite', 'Acciones guardar y cancelar']

### 7. Gestión de usuarios
- **purpose**: Administración de cuentas y roles del equipo.
- **sections**: ['Lista de usuarios', 'Búsqueda de usuarios', 'Alta o invitación de usuario', 'Cambio de rol', 'Acciones de desactivación']

## Design Tokens

```json
{
  "colors": {
    "primary": {
      "base": "#2563EB",
      "hover": "#1D4ED8",
      "active": "#1E40AF",
      "subtle": "#EFF6FF",
      "border": "#BFDBFE"
    },
    "neutrals": {
      "canvas": "#F8FAFC",
      "surface": "#FFFFFF",
      "surface_muted": "#F1F5F9",
      "surface_strong": "#E2E8F0",
      "border": "#E2E8F0",
      "border_strong": "#CBD5E1",
      "text_primary": "#0F172A",
      "text_secondary": "#475569",
      "text_tertiary": "#64748B",
      "text_disabled": "#94A3B8",
      "white": "#FFFFFF"
    },
    "semantic": {
      "success": "#059669",
      "success_bg": "#ECFDF5",
      "success_border": "#A7F3D0",
      "warning": "#D97706",
      "warning_bg": "#FFF7ED",
      "warning_border": "#FED7AA",
      "danger": "#DC2626",
      "danger_bg": "#FEF2F2",
      "danger_border": "#FECACA",
      "info": "#2563EB",
      "info_bg": "#EFF6FF",
      "info_border": "#BFDBFE",
      "overdue": "#B91C1C"
    },
    "status": {
      "pending": "#64748B",
      "pending_bg": "#F1F5F9",
      "in_progress": "#2563EB",
      "in_progress_bg": "#EFF6FF",
      "done": "#059669",
      "done_bg": "#ECFDF5"
    },
    "priority": {
      "high": "#DC2626",
      "high_bg": "#FEF2F2",
      "medium": "#D97706",
      "medium_bg": "#FFF7ED",
      "low": "#64748B",
      "low_bg": "#F1F5F9"
    }
  },
  "typography": {
    "font_family": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "weights": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "sizes": {
      "display": {
        "size": "28px",
        "line_height": "36px",
        "weight": 700,
        "letter_spacing": "-0.02em"
      },
      "h1": {
        "size": "22px",
        "line_height": "30px",
        "weight": 700,
        "letter_spacing": "-0.01em"
      },
      "h2": {
        "size": "18px",
        "line_height": "26px",
        "weight": 600
      },
      "body": {
        "size": "14px",
        "line_height": "20px",
        "weight": 400
      },
      "body_medium": {
        "size": "14px",
        "line_height": "20px",
        "weight": 500
      },
      "small": {
        "size": "12px",
        "line_height": "16px",
        "weight": 400
      },
      "caption": {
        "size": "11px",
        "line_height": "14px",
        "weight": 500,
        "letter_spacing": "0.02em"
      }
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "xl": "24px",
    "2xl": "32px",
    "3xl": "40px",
    "4xl": "48px",
    "page_padding_desktop": "32px",
    "page_padding_mobile": "16px"
  },
  "radii": {
    "sm": "6px",
    "md": "10px",
    "lg": "14px",
    "xl": "20px",
    "pill": "999px"
  },
  "shadows": {
    "subtle": "0px 1px 2px rgba(15, 23, 42, 0.05)",
    "card": "0px 1px 3px rgba(15, 23, 42, 0.06), 0px 1px 2px rgba(15, 23, 42, 0.04)",
    "sticky": "0px 4px 12px rgba(15, 23, 42, 0.08)",
    "overlay": "0px 16px 40px rgba(15, 23, 42, 0.16)"
  },
  "icon_image_style": {
    "style": "Iconograf\u00eda lineal con trazo de 1.5px, esquinas redondeadas y tama\u00f1o base de 20px sobre rejilla de 24px. Estilo consistente con Lucide o Feather.",
    "avatar": "Avatares circulares con iniciales, fondo neutro y texto secundario; sin fotograf\u00edas en la fase inicial.",
    "empty_states": "Ilustraciones simples en gris claro con acento primario sutil, evitando ornamentaci\u00f3n excesiva."
  },
  "motion_interaction": {
    "duration_fast": "120ms ease-out",
    "duration_base": "180ms ease-in-out",
    "duration_modal": "220ms ease-out",
    "hover": "Cambio de color y elevaci\u00f3n sutil de 1px en elementos interactivos.",
    "focus_ring": "Anillo visible de 3px con color primario al 25% de opacidad en todos los controles.",
    "reduced_motion": "Respetar prefers-reduced-motion desactivando transiciones no esenciales."
  },
  "accessibility": {
    "contrast": "Texto principal sobre superficie blanca con contraste m\u00ednimo AA/AAA; los estados y prioridades incluyen \u00edcono/texto adem\u00e1s de color.",
    "touch_targets": "Botones y controles interactivos con \u00e1rea m\u00ednima de 40x40px.",
    "form_labels": "Etiquetas siempre visibles y mensajes de error descriptivos asociados por aria-describedby."
  },
  "layout": {
    "sidebar_width": "248px",
    "content_max_width": "1240px",
    "card_gap": "16px",
    "metric_card_min_height": "128px",
    "table_min_width_desktop": "760px"
  }
}
```

## Base Components

### `Navegación principal`

Props:
```json
[
  "activeKey: string",
  "isAdmin: boolean",
  "userName: string",
  "userInitials: string",
  "onNavigate: (key: string) => void"
]
```

### `Botón CTA`

Props:
```json
[
  "label: string",
  "variant?: 'primary' | 'secondary' | 'ghost' | 'danger'",
  "size?: 'sm' | 'md' | 'lg'",
  "icon?: ReactNode",
  "iconPosition?: 'left' | 'right'",
  "disabled?: boolean",
  "onClick: () => void"
]
```

### `Tarjeta de tarea`

Props:
```json
[
  "task: { id: string; title: string; description?: string; assignee: string; dueDate: string; priority: 'alta' | 'media' | 'baja'; status: 'pendiente' | 'en curso' | 'terminada'; isOverdue: boolean }",
  "onStatusChange: (id: string, status: string) => void",
  "onEdit: (id: string) => void"
]
```

### `Card`

Props:
```json
[
  "children: ReactNode",
  "padding?: 'sm' | 'md' | 'lg'",
  "elevation?: 'subtle' | 'card' | 'sticky'",
  "className?: string"
]
```

### `Badge de prioridad`

Props:
```json
[
  "priority: 'alta' | 'media' | 'baja'",
  "size?: 'sm' | 'md'"
]
```

### `Badge de estado`

Props:
```json
[
  "status: 'pendiente' | 'en curso' | 'terminada'",
  "size?: 'sm' | 'md'"
]
```

### `Campo de formulario`

Props:
```json
[
  "label: string",
  "name: string",
  "type?: 'text' | 'email' | 'password' | 'textarea'",
  "placeholder?: string",
  "value: string",
  "onChange: (value: string) => void",
  "error?: string",
  "required?: boolean",
  "autoComplete?: string"
]
```

### `Selector`

Props:
```json
[
  "label: string",
  "name: string",
  "options: Array<{ value: string; label: string }>",
  "value: string",
  "onChange: (value: string) => void",
  "placeholder?: string",
  "error?: string",
  "required?: boolean"
]
```

### `Tabla de usuarios`

Props:
```json
[
  "users: Array<{ id: string; name: string; email: string; role: 'admin' | 'member'; active: boolean }>",
  "onDeactivate: (id: string) => void",
  "onRoleChange: (id: string, role: string) => void"
]
```

### `Estado vacío`

Props:
```json
[
  "title: string",
  "description: string",
  "actionLabel?: string",
  "onAction?: () => void"
]
```


## Preliminary Spec

```json
{
  "site_goal": "Resolver la p\u00e9rdida de pendientes y la falta de claridad sobre urgencia y vencimiento de tareas, permitiendo crear, asignar y actualizar tareas con prioridad y fecha l\u00edmite, ver las tareas vencidas del equipo y un resumen del estado general.",
  "audience": "Miembros de equipos de desarrollo, administrador",
  "brand_tone": "Neutro, moderno y limpio",
  "visual_references": [],
  "constraints": [
    "Ejecuci\u00f3n local con Docker Compose en la fase inicial",
    "Sin integraciones con sistemas externos",
    "Funcionalidad b\u00e1sica priorizando usabilidad y adopci\u00f3n"
  ],
  "sections_or_pages": [
    "Registro",
    "Inicio de sesi\u00f3n",
    "Gesti\u00f3n de usuarios",
    "Creaci\u00f3n de tareas con prioridad y fecha l\u00edmite",
    "Vista de tareas propias",
    "Vista de tareas vencidas del equipo",
    "Resumen de tareas (pendientes",
    "en curso",
    "terminadas)",
    "Resumen de tareas (pendientes, en curso, terminadas)"
  ],
  "confirmed_assumptions": [
    "El usuario confirm\u00f3 que los \u00fanicos perfiles de uso son el equipo de desarrollo y el administrador."
  ],
  "design_requirements": {
    "technical_or_figma_context": "Frontend en React 18; ejecuci\u00f3n local con Docker Compose."
  },
  "open_questions": [],
  "gaps_to_resolve": [],
  "item_attempts": {
    "audiencia": 1,
    "tono": 1,
    "pantallas": 1
  },
  "last_asked": null,
  "last_asked_options": null,
  "confirmed_items": [
    "audiencia",
    "pantallas",
    "tono"
  ],
  "assumed_items": [],
  "ready_for_phase_2": true,
  "status": "complete",
  "readiness_reason": "Objetivo, audiencia, tono y pantallas confirmados; no quedan preguntas bloqueantes."
}
```

## Figma Design Context (layout, spacing, component tree)

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "get_design_context",
    "auth_required": false,
    "message": "A nodeId is required to retrieve design context; none was provided.",
    "figma": {}
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [
    {
      "tool": "get_design_context",
      "status": "in_progress",
      "error": null,
      "text": ""
    },
    {
      "tool": "get_design_context",
      "status": "failed",
      "error": null,
      "text": "Input validation error: Invalid arguments for tool get_design_context: nodeId: Invalid input: expected string, received undefined\n"
    }
  ],
  "error": "Figma did not confirm completion of the requested operation.",
  "error_code": "figma_tool_unverified",
  "tool_evidence_required": [
    "get_design_context"
  ]
}
```

## Figma Variable Definitions (token names + values)

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "get_variable_defs",
    "auth_required": false,
    "message": "Figma requires a concrete node_id for variable definitions, but none was provided.",
    "figma": {}
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [
    {
      "tool": "get_variable_defs",
      "status": "in_progress",
      "error": null,
      "text": ""
    },
    {
      "tool": "get_variable_defs",
      "status": "failed",
      "error": null,
      "text": "Input validation error: Invalid arguments for tool get_variable_defs: nodeId: Invalid input: expected string, received undefined\n"
    }
  ],
  "error": "Figma did not confirm completion of the requested operation.",
  "error_code": "figma_tool_unverified",
  "tool_evidence_required": [
    "get_variable_defs"
  ]
}
```

## Code Connect Map (Figma component → code file)

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "get_code_connect_map",
    "auth_required": false,
    "message": "Code Connect requires a Dev or Full seat on an Organization or Enterprise plan.",
    "figma": {
      "file_key": "6r6r5cR6rMZleGrRUUOCl8",
      "node_id": "0:1"
    }
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [
    {
      "tool": "get_metadata",
      "status": "in_progress",
      "error": null,
      "text": ""
    },
    {
      "tool": "get_metadata",
      "status": "completed",
      "error": null,
      "text": "No nodeId was provided. Listing the top-level pages of the document. Call get_metadata again with one of the page ids below (or any node id underneath) to get the XML metadata for that subtree.\n\nTop-level pages of the document:\n- 0:1: Design System\n644471f8-a487-4198-ac9d-572ad99258bd\n"
    },
    {
      "tool": "get_code_connect_map",
      "status": "in_progress",
      "error": null,
      "text": ""
    },
    {
      "tool": "get_code_connect_map",
      "status": "completed",
      "error": null,
      "text": "You need a Dev or Full seat on an Organization or Enterprise plan to use Code Connect. Ask a Figma admin to upgrade your plan or seat. Learn more: https://developers.figma.com/docs/code-connect/\nFigma Debug UUID: 6d10dc44-49af-47cc-b16a-bc44f65dccb2\n6d10dc44-49af-47cc-b16a-bc44f65dccb2\n"
    }
  ],
  "error": "Code Connect requires a Dev or Full seat on an Organization or Enterprise plan."
}
```

## Design System Rules

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "create_design_system_rules",
    "auth_required": false,
    "message": "The required Figma MCP tool is unavailable.",
    "figma": {}
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [],
  "error": "The required Figma MCP tool is unavailable."
}
```
