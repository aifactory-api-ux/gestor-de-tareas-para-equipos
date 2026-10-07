# Component Guide

Quick reference for components and design tokens. Use exact names — do not rename or create synonyms.

## Token Quick Reference

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

## Available Components

- **Navegación principal**: 
- **Botón CTA**: 
- **Tarjeta de tarea**: 
- **Card**: 
- **Badge de prioridad**: 
- **Badge de estado**: 
- **Campo de formulario**: 
- **Selector**: 
- **Tabla de usuarios**: 
- **Estado vacío**: 
