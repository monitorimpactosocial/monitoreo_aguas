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

### Recuperacion de figuras y tablas de la version anterior
- El usuario indico que las figuras y tablas de la version anterior eran utiles y debian reincorporarse sin perder la edicion limpia.
- Se mantuvo la primera pantalla simplificada y se agrego una capa de analisis ampliado:
  - Figuras complementarias en `Resumen`:
    - Tipos de punto.
    - Comparabilidad por anio.
    - Parametros mas visibles.
  - Tablas tecnicas completas recuperadas como secciones desplegables:
    - `Rio Paraguay`: tabla completa con color, DE, enfoques, representatividad y fuente.
    - `Series`: matriz completa con componente, medio, DE, bases 2021/2023, deltas y representatividad.
    - `Calidad estadistica`: compatibilidad completa con color y metadatos.
    - `Fuentes`: trazabilidad completa con componente, medio, representatividad y fuente.
- Se restauro el limite de series del grafico principal a 10, como en la version anterior, manteniendo la lectura inicial focalizada.
- Verificaciones:
  - `node --check app\app.js`: sintaxis correcta.
  - Validacion estatica: IDs y funciones nuevas enlazadas correctamente.
  - Captura local de escritorio: `C:\tmp\monitoreo_agua_recuperado.png`.
- Commit publicado: `7944da5`.
- Verificacion posterior a GitHub Pages: `https://monitorimpactosocial.github.io/monitoreo_aguas/app/?v=7944da5b` respondio 200 y ya contiene `Figuras complementarias` y `tabla tecnica completa`.

### Recuperacion de la primera version original
- El usuario aclaro que la recuperacion solicitada se referia a la primera version real del repositorio, no a la version inmediatamente anterior.
- Se identifico como referencia inicial el commit raiz `22802722e70bd5701e4f50367444ff0396c8648f`, que contenia la app original con registro, estadisticas y mapa.
- Se incorporo una nueva vista `Primera version` en `app\index.html`, separada de la vista moderna para evitar mezclar lecturas.
- Elementos recuperados y reconstruidos:
  - `% Cumplimiento por campania`.
  - `Cumplimiento por subcuenca`.
  - `Parametros con mayor incumplimiento`.
  - `Ultimo % cumplimiento por punto`.
  - Mapa estatico de puntos de monitoreo con filtro por subcuenca.
  - Tabla de resumen historico de campanias.
  - Tabla de ultimos registros.
- La vista usa el dataset legado local `data.json`, verificado con 229 registros, y conserva la serie historica 2021-2025 y los puntos activos de la primera version.
- Se ajusto la experiencia visual para que esta pestaña no herede los filtros modernos de la app actual, reduciendo ruido y mejorando la lectura ejecutiva.
- Verificaciones realizadas:
  - `node --check app\app.js`: sintaxis correcta.
  - Validacion estatica de IDs, funciones y existencia de `data.json`: correcta.
  - Servidor local `http://127.0.0.1:8789/app/?view=legacy`: respuesta 200.
  - Verificacion HTML local: presentes `legacyCumplFigure`, `legacySubFigure`, `legacyParamFigure`, `legacyPointFigure`, `legacyHistoricoTable`, `legacyLastRecords` y `legacyMap`.
- Observacion: en este entorno puntual `require('playwright')` no estuvo disponible dentro del repo, por lo que la captura automatizada no se pudo regenerar en esta pasada; la validacion funcional se completo por sintaxis, servidor local y presencia de la vista/controles/datasets.
- Commit funcional publicado: `5a269cd`.
- Verificacion posterior a GitHub Pages:
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/?view=legacy&v=5a269cd-2` respondio 200.
  - La version publicada ya contiene `legacyCumplFigure` y `data-view="legacy"`.

### Redisenio de controles y recuperacion visual del mapeo
- El usuario indico que la app seguia aburrida y que debia priorizar botones antes que listas desplegables, ademas de recuperar mejor el mapeo y figuras visuales.
- Se reemplazo la interaccion visible de filtros por botones tipo chips:
  - Cauce o sistema.
  - Parametros.
  - Anios.
  - Puntos.
  - Componente, medio, tipo de punto, lectura y entrada/salida en opciones avanzadas.
  - Filtro de subcuenca en la vista `Primera version`.
- Los `select` quedan solo como motor interno oculto para conservar la logica existente, pero ya no son la interfaz visible.
- Se cambio tambien la vista `Ajustar metadatos`: la clasificacion de puntos ahora usa botones por fila en lugar de listas desplegables.
- Se agrego un panel protagonista `Mapa vivo` en el resumen:
  - Dibuja una red territorial con Rio Paraguay, arroyos y puntos.
  - Colorea puntos por Entrada, Medio, Salida, Pozo o sin clasificar.
  - Incluye modos por botones: Todos, Entrada/salida, Alertas y Comparables.
  - Agrega tarjetas de lectura territorial: puntos visibles, cauces/sistemas, alertas, comparabilidad y composicion.
- Se ajusto el comportamiento visual de los chips para que los seleccionados suban automaticamente arriba y no queden escondidos dentro de cajas con scroll.
- Verificaciones realizadas:
  - `node --check app\app.js`: sintaxis correcta.
  - Servidor local `http://127.0.0.1:8790/app/`: respuesta 200.
  - Captura escritorio: `C:\tmp\monitoreo_agua_botones_mapa_v2.png`.
  - Captura movil: `C:\tmp\monitoreo_agua_botones_mapa_mobile.png`.
  - Captura de `Primera version`: `C:\tmp\monitoreo_agua_legacy_botones.png`.
- Commit funcional publicado: `6d91d83`.
- Verificacion posterior a GitHub Pages:
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/?v=6d91d83-2` respondio 200.
  - La version publicada ya contiene `liveMap` y `parameterChoices`.

### Compactacion de botones y mapa GIS real
- El usuario solicito botones mas pequenios, mas ordenados en filas/columnas y uso de mapa real desde `C:\Users\DiegoMeza\OneDrive - PARACEL S.A\Archivos de Jose Nicolas Duarte - GIS PARACEL (NICO)`.
- Se reviso la carpeta GIS indicada. La imagen `Mapas\Accesos al SITE.png` aparecio listada, pero Windows devolvio `El proveedor de archivos de nube no se esta ejecutando (os error 362)`, por lo que no pudo copiarse ni abrirse en esta pasada.
- Se usaron capas GIS locales legibles de `Shape PARACEL`:
  - `ComponentesPARACEL.shp`.
  - `Distritos_Paracel3.shp`.
  - `BarLoc2022_Amambay.shp`.
  - `ComunidadesParacel_Limites.shp`.
- Se genero el nuevo asset liviano `app\gis_map.js` con 126 entidades simplificadas y 24 puntos georreferenciados de monitoreo, manteniendo la app rapida para GitHub Pages.
- El mapa vivo del resumen ahora usa base cartografica real PARACEL en coordenadas `WGS_1984_UTM_Zone_21S`, con puntos del monitoreo superpuestos.
- Se compacto la UI de filtros:
  - Botones en matriz por filas y columnas.
  - Menor altura, menor tipografia y truncado ordenado.
  - Los `select` siguen ocultos como motor tecnico, no como interfaz visible.
- Verificaciones realizadas:
  - `node --check app\app.js`: correcto.
  - `node --check app\gis_map.js`: correcto.
  - Servidor local `http://127.0.0.1:8791/app/`: respuesta 200.
  - Captura escritorio: `C:\tmp\monitoreo_agua_gis_compacto.png`.
  - Captura movil: `C:\tmp\monitoreo_agua_gis_compacto_mobile.png`.
- Commit funcional publicado: `2c03a70`.
- Verificacion posterior a GitHub Pages:
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/?v=2c03a70-2` respondio 200 y ya contiene `gis_map.js`.
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/gis_map.js?v=2c03a70-2` respondio 200 y contiene `PARACEL_GIS_MAP`.

### Incorporacion de rios reales desde geodatos
- El usuario aclaro que los rios tambien podian graficarse y que la capa estaba en `G:\Mi unidad\geodatos\hidrografia`.
- Se identifico la capa `Hidrografia.shp` con archivos complementarios `Hidrografia.dbf`, `Hidrografia.shx` y `Hidrografia.prj`.
- La proyeccion de hidrografia es `EPSG:4326`; se transformo a `WGS_1984_UTM_Zone_21S` para coincidir con el mapa PARACEL ya generado.
- Se filtro la hidrografia al entorno del mapa y se simplifico para publicacion web:
  - 220 segmentos de rios/cursos de agua incorporados en `app\gis_map.js`.
  - Rio Paraguay queda destacado con trazo mas grueso.
  - Los cursos menores quedan como lineas azules suaves bajo las capas PARACEL.
- Se ajusto `app\app.js` para renderizar capas lineales reales (`lines`) sin cerrarlas como poligonos.
- Se agrego una tarjeta de lectura `Rios graficados` al panel territorial.
- Verificaciones realizadas:
  - `node --check app\app.js`: correcto.
  - `node --check app\gis_map.js`: correcto.
  - Validacion del asset: 346 entidades totales, 220 de hidrografia y presencia de `Rio Paraguay`.
  - Servidor local `http://127.0.0.1:8792/app/`: respuesta 200.
  - Captura escritorio: `C:\tmp\monitoreo_agua_gis_hidrografia.png`.
  - Captura movil: `C:\tmp\monitoreo_agua_gis_hidrografia_mobile.png`.
- Commit funcional publicado: `22ec532`.
- Verificacion posterior a GitHub Pages:
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/gis_map.js?v=22ec532-2` respondio 200.
  - El asset publicado ya contiene `hydrology` y `Rio Paraguay`.
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/?v=22ec532-2` respondio 200 y carga `gis_map.js`.

### Interaccion fina de puntos del mapa
- El usuario indico que los puntos se veian demasiado grandes y que debia aparecer un bloque de informacion al pasar el cursor; ademas, al hacer clic sobre un punto, este debia filtrar todas las vistas.
- Se redujo el radio de los puntos en el mapa sintetico y en el mapa GIS real para que no tapen la base cartografica ni los rios.
- Se agrego un bloque emergente al pasar el cursor o enfocar por teclado:
  - Punto, cauce o sistema y tipo de punto.
  - Registros, comparables, alertas, parametros y anios disponibles.
  - Indicacion clara de que el clic filtra todas las vistas.
- Se agrego interaccion por clic y por teclado (`Enter`/`Espacio`) sobre cada punto.
- El clic selecciona el punto en el filtro global `pointFilter`, sincroniza los botones visibles y ejecuta `renderAll()`, por lo que afecta resumen, mapa, series, Rio Paraguay, compatibilidad, tablas y figuras derivadas del filtro actual.
- Se corrigio un problema detectado en la prueba real: algunas capas de fondo del GIS interceptaban el cursor. Las capas territoriales, labels y fuente ahora quedan como base visual sin capturar eventos, dejando los puntos realmente clickeables.
- Verificaciones realizadas:
  - `node --check app\app.js`: correcto.
  - `node --check app\gis_map.js`: correcto.
  - Servidor local `http://127.0.0.1:8793/app/`: respuesta 200.
  - Prueba Playwright local: hover muestra el bloque emergente y click sobre `FW01-PY` deja seleccionado un unico punto de Rio Paraguay, con 1 punto visible tras el filtro.
  - Captura QA: `C:\tmp\monitoreo_agua_hover_punto.png`.
- Commit funcional publicado: `476e431`.
- Verificacion posterior a GitHub Pages:
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/?v=476e431` respondio 200.
  - `https://monitorimpactosocial.github.io/monitoreo_aguas/app/app.js?v=476e431-2` respondio 200.
  - El asset publicado ya contiene `map-hover-card` y `selectPointFromMap`.
