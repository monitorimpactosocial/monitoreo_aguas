# Bitacora - Monitoreo de Agua PARACEL

## 2026-05-12

### Inicio de intervencion
- Se ubico la carpeta operativa del proyecto en `G:\Mi unidad\MONITOREO_AGUA`.
- No se encontro una bitacora previa dentro de la carpeta, por lo que se crea este archivo para asegurar continuidad.
- La carpeta no es un repositorio Git local; contiene un acceso `MONITOREO_AGUA.gsheet`, informes de consultoria en DOCX/PDF y anexos estadisticos en Excel.
- El archivo `MONITOREO_AGUA.gsheet` no pudo leerse desde el sistema de archivos local por limitacion de Google Drive Desktop (`Funcion incorrecta`).
- Se intento acceder mediante conector Google Drive, pero el token respondio expirado. Queda pendiente reautenticar si se requiere editar directamente el Google Sheet en linea desde Codex.

### Requerimientos recibidos
- Agregar puntos al filtro y resolver compatibilidad historica por movimiento de puntos entre anios.
- Permitir seleccionar solo puntos comparables.
- Incorporar analisis de representatividad por muestras pequenas y pruebas estadisticas de comparacion.
- Revisar informe enviado por consultora y calculos estadisticos asociados.
- Considerar lineas de base 2021 y 2023.
- Documentar evolucion de parametros: 29 parametros iniciales y aproximadamente 35 actuales.
- Habilitar una pestana de demostracion estadistica de compatibilidad.
- Segmentar por entradas, salidas y puntos medios a los cauces.
- Incorporar Rio Paraguay en el analisis del tablero con clasificacion entrada, medio y salida.
- Agregar filtros por anio, parametro y seleccion multiple de parametros.
- Agregar limites de desviacion en figuras para detectar desvios relevantes.
- Agregar boton o acceso para editar datos.
- Corregir problemas de idioma y caracteres especiales.

### Proximo procedimiento
- Inventariar hojas y tablas en anexos Excel.
- Extraer texto estructurado del informe de consultoria para identificar criterios estadisticos, puntos, parametros y conclusiones.
- Proponer o construir una capa normalizada de datos para que el tablero filtre por anio, punto, parametro, tipo de punto y comparabilidad sin depender solo de colores de pestanas.

### Inventario local de fuentes
- Se creo `scripts/audit_sources.py` para inventariar anexos y extraer evidencias del informe vigente.
- Resultado: 31 archivos Excel, 54 hojas y extraccion del informe `Informe analisis estadistico calidad de agua PARACEL v04.docx`.
- Fuentes relevantes identificadas:
  - `Anexos\Agua superficial\Industrial\REsultados compilados Rio PAraguay_ todos los parametros.xlsx`: resumen por puntos FW01-PY, FW02-PY y FW03-PY.
  - `Anexos\Agua superficial\Industrial\Resultados Kruskall Wallis.xlsx`: pruebas Kruskal-Wallis entre puntos para Rio Paraguay.
  - `Anexos\Agua superficial\Industrial\Kruskal Wallis_ANIOS_FISICOQUIMICOS.xlsx`: pruebas por anio para fisicoquimicos de Rio Paraguay.
  - `Anexos\Agua superficial\Forestal\Medidas resumen corregido.xls`: resumen por arroyos forestales.
  - `Anexos\Agua superficial\Forestal\Kruskal Wallis.xlsx`: pruebas por anio en aguas superficiales forestales.
  - `Anexos\Agua subterranea\Pozos_Forestal\Resultados en una columna_pozosFOR revisado.xlsx`: datos normalizados de pozos forestales.
  - `Anexos\Agua subterranea\Pozos_Industrial\POZOS_INDUSTRIAL.xlsx`: serie de pozos industriales por campania.
- El informe confirma el criterio estadistico central: Shapiro-Wilk para normalidad, ANOVA si p>0,05, Kruskal-Wallis si p<0,05 y post hoc Tukey cuando corresponde. Tambien advierte heterogeneidad por puntos agregados/descartados y que se requieren al menos dos resultados por anio y punto para aplicar pruebas.

### Ajuste adicional solicitado
- Se agregara un sistema de notas `(i)` en la app para explicar metricas, conceptos, criterios estadisticos, determinaciones, limites de interpretacion y observaciones de uso.
- Las notas deben ayudar al usuario a entender que representa cada dato y por que ciertos puntos/anios se consideran o no comparables.

### Capa normalizada y app local
- Se creo `scripts/build_dashboard_data.py` para construir una capa local rapida sin consultar el Google Sheet en vivo.
- Salidas generadas:
  - `data\monitoring_dataset.json`: dataset completo con registros crudos, series, catalogos y pruebas.
  - `app\monitoring_dataset.js`: dataset liviano para la app, sin registros crudos para acelerar la carga.
- Resultado de generacion: 5.203 registros base, 2.954 registros de serie, 86 pruebas estadisticas, 40 puntos y 55 parametros normalizados.
- Se creo la app local en `app\index.html`, `app\styles.css` y `app\app.js`.
- Funcionalidades incorporadas:
  - Pestanas superiores: Tablero, Evolucion, Compatibilidad, Datos, Guia de lectura y Editar datos.
  - Filtros por componente, medio, cauce/sistema, tipo de punto, parametros multiples, puntos multiples y anios.
  - Filtro "Solo comparables" para separar datos concluyentes de datos referenciales.
  - Segmentacion operativa del Rio Paraguay: FW01-PY=Entrada, FW02-PY=Medio, FW03-PY=Salida.
  - Botones rapidos para Hierro soluble y Rio Paraguay.
  - Grafico SVG local con modo valores reales o base 100 cuando se mezclan parametros.
  - Limite ajustable de desviacion en desviaciones estandar.
  - Tabla de evolucion, tabla de trazabilidad y exportacion CSV/JSON.
  - Pestana de demostracion estadistica con pruebas Kruskal-Wallis extraidas de anexos.
  - Modo de edicion segura de metadatos de puntos mediante localStorage y exportacion de ajustes.
  - Notas `(i)` en filtros, metricas, graficos, compatibilidad, estadistica, datos y edicion.
- Verificaciones realizadas:
  - `node --check app\app.js`: sintaxis correcta.
  - Validacion del dataset JS: carga JSON correcta, mas de 2.500 series, Rio Paraguay con punto de entrada y parametro `hierro_soluble`.
  - Revision de enlaces `(i)`: todas las claves `data-note` tienen nota definida.
  - Revision UTF-8: no se detectaron caracteres de reemplazo en HTML, JS ni dataset.
- Limitacion: no se ejecuto QA visual con navegador porque no hay Playwright ni navegador headless disponible en este entorno.

### Ajustes solicitados sobre filtros y Rio Paraguay
- Se solicita agregar filtros globales tambien en el panel lateral:
  - Enfoque 1: Por Campania.
  - Enfoque 2: En el Tiempo.
  - Enfoque 3: Evolucion del Programa.
  - Entrada / Salida.
- Estos filtros deben afectar todas las vistas, no solamente el tablero principal.
- Para identificar entrada, salida e intermedio se debe considerar el color de pestana de las hojas cuando el libro lo conserve: rojo=entrada, verde=salida, amarillo=intermedio.
- Se solicita habilitar una pestana nueva con los datos especificos del Rio Paraguay, buscando libro y hoja asociados.

### Implementacion de filtros laterales y pestana Rio Paraguay
- Se regenero `data\monitoring_dataset.json` y `app\monitoring_dataset.js` con:
  - Campo `approaches` por serie para filtrar Enfoque 1 Por Campania, Enfoque 2 En el Tiempo y Enfoque 3 Evolucion del Programa.
  - Metadatos `sheet_tab_color`, `sheet_tab_color_label` y `point_type_source` para documentar la regla rojo=entrada, verde=salida y amarillo=intermedio.
  - Catalogo `rio_paraguay_sources` con libros y hojas asociados a Rio Paraguay.
- Se verifico que los `.xlsx` locales no preservan colores de pestana visibles por `openpyxl`; el acceso `MONITOREO_AGUA.gsheet` tampoco puede leerse como archivo local (`Funcion incorrecta`). Por eso la app queda preparada para colores de pestana y, para Rio Paraguay, usa la regla operativa equivalente: FW01-PY=Entrada, FW02-PY=Medio y FW03-PY=Salida.
- Libros/hojas asociados a Rio Paraguay incorporados en la nueva vista:
  - `Anexos\Agua superficial\Industrial\REsultados compilados Rio PAraguay_ todos los parametros.xlsx` / `Comparacion puntos_muestreo`.
  - `Anexos\Agua superficial\Industrial\Resultados Kruskall Wallis.xlsx` / `Sheet1`.
  - `Anexos\Agua superficial\Industrial\Kruskal Wallis_ANIOS_FISICOQUIMICOS.xlsx` / `Sheet1`.
  - `Anexos\Agua superficial\Industrial\SHAPIRO_FW_RIOPY.xlsx` / `Sheet1`.
  - `Anexos\Agua superficial\Industrial\KruskalWallis_PesticidasRioPY_entre campanias.xlsx` / `Sheet1`.
- Se modifico `app\index.html`:
  - Nueva pestana superior `Rio Paraguay`.
  - Panel lateral global con filtros de enfoques y Entrada/Salida.
  - Leyenda visual de entrada, intermedio y salida.
- Se modifico `app\app.js`:
  - Los filtros laterales afectan tablero, evolucion, compatibilidad, datos, guia, edicion y Rio Paraguay.
  - La tabla de compatibilidad ahora se recalcula desde la serie filtrada para respetar todos los filtros.
  - La pestana Rio Paraguay muestra fuentes asociadas, KPIs y tabla de datos filtrados del rio.
  - Se agregaron notas `(i)` para panel lateral y Rio Paraguay.
- Verificaciones realizadas:
  - `node --check app\app.js`: sintaxis correcta.
  - Validacion estatica: todos los `data-note` tienen nota definida; existen `approachFilter`, `flowFilter`, `rio`, `rioTable` y `forceRioView`.
  - Validacion dataset: filtros de enfoques disponibles, fuente `Comparacion puntos_muestreo` registrada y series de Rio Paraguay con `Entrada` y `Enfoque 3`.

### Cierre ampliado de la reunion de monitoreo de agua
- Se ajusto la regla de colores final del usuario: rojo=entrada, verde=salida y amarillo=punto medio.
- Se agregaron referencias frente a linea de base 2021 y 2023 cuando existen datos del mismo punto y parametro.
- Se agregaron campos de representatividad por n y recomendacion de prueba para muestras pequenas:
  - n<2: dato aislado, sin inferencia.
  - n<5: muestra pequena, priorizar prueba no parametrica/exacta/permutacion.
  - n>=5: revisar Shapiro-Wilk y aplicar ANOVA o Kruskal-Wallis segun normalidad.
- Se ampliaron ayudas `(i)` en filtros, panel lateral y encabezados de tablas dinamicas.
- Se amplio la Guia de lectura con conceptos de n, promedio, mediana, desviacion estandar, p-valor, H de Kruskal-Wallis, lineas de base, dato referencial/comparable, campania, periodo, fuente, determinacion y caracteres especiales.
- Se agrego nota sobre el alcance del programa: 29 parametros iniciales y aproximadamente 35 actuales; la app puede mostrar mas etiquetas por integrar anexos y pruebas estadisticas.
- Se regeneraron `data\monitoring_dataset.json` y `app\monitoring_dataset.js`.
- Se agrego `.gitignore` para excluir anexos, informes Office/PDF, acceso `.gsheet` y temporales pesados del control de versiones. La app versiona datos normalizados, scripts, interfaz y bitacora.
- Se inicializo repositorio Git local en `G:\Mi unidad\MONITOREO_AGUA`.
- Se preparo commit local con app, scripts, datos normalizados y bitacora.
- Intento de push: bloqueado porque el repositorio no tiene remoto configurado y `gh` no esta instalado para crear/publicar un repo automaticamente. Git devolvio: `fatal: No configured push destination`.

### Reintento de commit y push
- Se reintento el `git push` a pedido del usuario.
- Resultado del push: vuelve a fallar porque el repositorio local no tiene remoto configurado. Git devolvio: `fatal: No configured push destination`.
- Se verifico nuevamente el dataset local:
  - 5.203 registros base.
  - 2.954 registros de serie.
  - 86 pruebas estadisticas.
  - 40 puntos.
  - 55 parametros.
  - Anios disponibles: 2021, 2022 y 2023.
- Se corrigio la senial explicita de color en la capa de datos:
  - `Entrada` queda con `point_color=#C62828` y color de pestana rojo.
  - `Salida` queda con `point_color=#2E7D32` y color de pestana verde.
  - `Medio` queda con `point_color=#F9A825` y color de pestana amarillo.
- Se agrego visualizacion de muestra de color en las tablas de compatibilidad y Rio Paraguay.
- Verificaciones posteriores:
  - `python scripts\build_dashboard_data.py`: regeneracion correcta.
  - `node --check app\app.js`: sintaxis correcta.
  - Validacion del JSON: Rio Paraguay presente, fuentes asociadas registradas, lineas de base 2021/2023 presentes y colores Entrada/Salida/Medio correctos.
- Queda pendiente solamente configurar el remoto para completar el push.

### Configuracion del remoto real
- El usuario confirmo la URL publica del reporte: `https://monitorimpactosocial.github.io/monitoreo_aguas/`.
- Se dedujo y verifico el repositorio remoto: `https://github.com/monitorimpactosocial/monitoreo_aguas.git`.
- La rama remota por defecto es `main` y ya tenia historia previa; por eso se preservo esa historia y se rebaso el commit local encima de `origin/main`, sin forzar ni borrar la app anterior del historial.
- Se reemplazo `index.html` de la raiz por una entrada liviana que redirige a `app/`, de modo que la URL publica del reporte abra la nueva app generada en `app\index.html`.
- Verificaciones realizadas antes del nuevo push:
  - `node --check app\app.js`: sintaxis correcta.
  - Validacion del dataset JSON: Rio Paraguay presente, Entrada roja, Salida verde, Medio amarillo, bases 2021/2023 y fuentes asociadas.
  - Validacion de raiz publica: `index.html` apunta a `app/`.

### Push exitoso
- Se ejecuto `git push -u origin main`.
- Resultado: push exitoso al repositorio `https://github.com/monitorimpactosocial/monitoreo_aguas.git`.
- Commit publicado: `fac81e6`.
- La URL publica esperada queda: `https://monitorimpactosocial.github.io/monitoreo_aguas/`, con redireccion automatica a la nueva app en `app/`.

### Redisenio de claridad visual
- El usuario reporto que la app funcionaba, pero se veia muy llena, apretada, desordenada y dificil de entender.
- Se simplifico la primera pantalla:
  - Navegacion principal reducida a `Resumen`, `Rio Paraguay`, `Series`, `Calidad estadistica` y `Fuentes`.
  - Se elimino el panel lateral visible para evitar doble lectura.
  - Los filtros tecnicos quedaron dentro de `Opciones avanzadas, trazabilidad y administracion`.
  - La pantalla inicial queda enfocada en `Rio Paraguay` + `Hierro soluble`, evitando abrir con demasiadas series mezcladas.
- Se reorganizo el tablero como lectura ejecutiva:
  - Bloque inicial con contexto.
  - Cuatro metricas principales.
  - Grafico de evolucion en una tarjeta amplia.
  - Lectura rapida y desvios separados debajo.
- Se redujo el ancho de tablas:
  - `Series` muestra solo columnas esenciales.
  - `Rio Paraguay` muestra punto, tipo, parametro, periodo, n, valor y estado.
  - La trazabilidad completa queda en `Fuentes`.
- Se corrigio una inconsistencia visual:
  - `Entrada` se muestra rojo.
  - `Intermedio` se muestra amarillo.
  - `Salida` se muestra verde.
- Verificaciones:
  - `node --check app\app.js`: sintaxis correcta.
  - Validacion estatica de IDs requeridos y dataset local: correcta.
  - Servidor local `http://127.0.0.1:8787/app/`: respuesta 200.
  - Capturas Playwright con Chrome:
    - Escritorio: `C:\tmp\monitoreo_agua_redesign_v2.png`.
    - Movil: `C:\tmp\monitoreo_agua_mobile.png`.
- Observacion: se intento una prueba programatica de consola con `npx -p playwright node`, pero el paquete no quedo resoluble por `require('playwright')` en ese modo. La verificacion visual por CLI de Playwright si funciono usando Chrome instalado.
- Commit publicado de la simplificacion visual: `bd41452`.
- Verificacion posterior a GitHub Pages: `https://monitorimpactosocial.github.io/monitoreo_aguas/app/?v=bd41452b` respondio 200 y ya contiene `Que se quiere revisar` y `Opciones avanzadas`.
