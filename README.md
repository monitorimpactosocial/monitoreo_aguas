# Monitoreo de Calidad del Agua — PARACEL S.A.

Sistema web de monitoreo de calidad del agua superficial. Programa **PR-SA-F04** | Área de Sustentabilidad Ambiental.

**Tablero publico:** https://monitorimpactosocial.github.io/monitoreo_aguas/

**Backend Apps Script vigente:** https://script.google.com/macros/s/AKfycbx_nVf5X3Y1VBsfMXWmFLxFmS4Xl8YuJtBB28wmtdHKZfE1T-b2HDhuZoMX76s_b0NS4w/exec

**Google Sheets (base de datos):** https://docs.google.com/spreadsheets/d/1VmBLNbeUCW1GtxrXz3zsUQl0HdRqc5SSUBdtMywql4U

---

## Funcionalidades

| Panel | Descripción |
|-------|-------------|
| **Registro** | Formulario completo para ingresar nuevas mediciones (34 parámetros). Validación de límites en tiempo real. Guarda en Google Sheets. |
| **Estadísticas** | Panel descriptivo con 4 gráficas: cumplimiento temporal (2021–2025), por subcuenca, por parámetro y por punto. Tabla histórica de campañas. |
| **Mapa** | Mapa Leaflet con los 20 puntos activos georeferenciados. Marcadores coloreados por nivel de cumplimiento. Filtro por subcuenca. |

---

## Estructura del Proyecto

```
Code.gs           ← Backend Google Apps Script (CRUD, estadísticas)
index.html        ← Frontend SPA (Bootstrap 5 + Chart.js + Leaflet)
appsscript.json   ← Manifest de Apps Script
.clasp.json       ← Configuración de clasp CLI
```

---

## Despliegue con clasp

### 1. Instalar y autenticar clasp
```bash
npm install -g @google/clasp
clasp login
```

### 2. Hacer push al proyecto de Apps Script
```bash
cd monitoreo_aguas
clasp push
```

### 3. Publicar nueva versión en Apps Script
1. Abrir el [editor de Apps Script](https://script.google.com/u/0/home/projects/1irdu9WqjMUffResZByuf69qj1IVShSSbEeBQQ4XsytTtMKw9z-8F03D9v/edit)
2. **Desplegar → Administrar implementaciones → Editar** (ícono de lápiz)
3. Versión: **Nueva versión**
4. Guardar → Actualizar

---

## Parámetros monitoreados (35)

### Fisicoquímicos (22)
Temperatura, Color, pH, Conductividad, Oxígeno Disuelto, Turbidez, Materiales Flotantes, TDS, Aceites/Grasas, DBO5, Fósforo Total, Nitrógeno Total, Nitratos, Amoniaco, Nitritos, Aluminio, Hierro Soluble, Clorofila A, Calcio, Potasio, SST, Magnesio

### Microbiológicos (3)
Coliformes Totales, Coliformes Fecales, E. coli

### Agroquímicos (9)
Glifosato, AMPA, Tebuconazole, Sulfluramida, Glufosinato, Flumioxazin, Fipronil, Isoxaflutole, Haloxifop

---

## Google Sheets — Estructura esperada

| Hoja | Descripción |
|------|-------------|
| `BD_PRINCIPAL` | Base de datos principal. Una fila por muestra (punto + campaña). |
| `PUNTOS` | Catálogo de puntos de monitoreo con coordenadas. |

La app crea estas hojas automáticamente si no existen en el primer `doGet()`.

---

## Subcuencas (20 puntos activos 2025)

| Subcuenca | Puntos |
|-----------|--------|
| Negla | FW 104-ZA, FW 190-ST, FW 320-ST |
| Napegue | FW 191-ST, FW 391-ST |
| Trementina | FW 102-SL, FW 208-TR, FW 109-MYRZ, FW 113-RC, FW 317-RZ |
| Hermosa | FW 107-HE, FW 322-HE |
| Zapiquem | FW 210-ZM |
| Itasilla | FW 130-SO |
| Pitanohaga | FW 230-VS, FW 318-VS, FW 106-DG, FW 326-DG |
| Aquidaban | FW 316-CR, FW 321-CR |

---

## Marco Normativo

- **Resolución SEAM/MADES N° 222/02** — Padrón de calidad de aguas, Clase 2
- **Resolución SEAM N° 255/06** — Clasificación de aguas superficiales del Paraguay
