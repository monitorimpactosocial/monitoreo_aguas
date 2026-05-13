const DATA = window.MONITORING_DATA || {};
const GIS_MAP = window.PARACEL_GIS_MAP || null;

const notes = {
  filters: {
    title: "Filtros del tablero",
    text: "Los filtros trabajan sobre una capa normalizada local. Puede combinar componente, medio, cauce, tipo de punto, años, puntos y múltiples parámetros sin depender de colores o posiciones de pestañas en Excel.",
  },
  componentFilterNote: {
    title: "Componente",
    text: "Separa el origen operativo del dato, por ejemplo Industrial o Forestal. Evita comparar sistemas con diseños de muestreo distintos sin filtrar previamente.",
  },
  mediumFilterNote: {
    title: "Medio monitoreado",
    text: "Distingue agua superficial de agua subterránea. Las métricas pueden parecer similares, pero la interpretación ambiental y estadística cambia entre cauces, ríos y pozos.",
  },
  waterBodyFilterNote: {
    title: "Cauce o sistema",
    text: "Agrupa puntos que pertenecen a un mismo río, arroyo, pozo o sistema consolidado. Es el filtro clave para no comparar sitios con dinámicas hidrológicas distintas.",
  },
  pointTypeFilterNote: {
    title: "Tipo de punto",
    text: "Clasifica el punto como entrada, intermedio, salida, pozo o no clasificado. Para este tablero la regla de color es rojo=entrada, verde=salida y amarillo=intermedio.",
  },
  parameterFilterNote: {
    title: "Parámetros",
    text: "Permite seleccionar uno o varios parámetros. Si se mezclan parámetros con unidades diferentes, el gráfico usa base 100 para leer tendencia sin confundir magnitudes.",
  },
  pointFilterNote: {
    title: "Puntos",
    text: "Permite seleccionar puntos específicos. Es importante porque algunos puntos se agregaron, movieron o dejaron de monitorearse entre años, afectando la comparabilidad.",
  },
  yearFilterNote: {
    title: "Años",
    text: "Filtra por año disponible. La app calcula referencias contra 2021 y contra 2023 cuando existen datos del mismo punto y parámetro.",
  },
  deviationLimitNote: {
    title: "Límite de desviación",
    text: "Controla cuántas desviaciones estándar se toleran antes de marcar una alerta. Sirve para priorizar revisión técnica, no para afirmar impacto causal por sí solo.",
  },
  sideFilters: {
    title: "Panel lateral global",
    text: "Estos filtros son transversales: Enfoque 1 revisa datos por campaña, Enfoque 2 prioriza lectura temporal y Enfoque 3 concentra evolución del programa. Entrada/Salida usa la clasificación por color de pestaña cuando está disponible.",
  },
  approachFilterNote: {
    title: "Enfoques de análisis",
    text: "Por Campaña mira mediciones asociadas a campañas; En el Tiempo prioriza comparación anual; Evolución del Programa concentra lectura acumulada o comparable para gestión.",
  },
  flowFilterNote: {
    title: "Entrada / salida",
    text: "Permite revisar gradientes a lo largo del cauce. La regla solicitada es rojo=entrada, amarillo=intermedio y verde=salida.",
  },
  comparable: {
    title: "Solo puntos comparables",
    text: "Un registro se considera comparable cuando hay al menos dos años con n>=2 para el mismo punto y parámetro, o cuando la consultora entregó una comparación consolidada con n suficiente. Los datos aislados se muestran, pero no deben usarse como demostración estadística concluyente.",
  },
  series: {
    title: "Registros de serie",
    text: "Cada registro resume una combinación de componente, medio, cauce, punto, parámetro y año o periodo. Puede venir de promedios/medianas ya calculados o de datos por campaña agregados por la app.",
  },
  points: {
    title: "Puntos de monitoreo",
    text: "Incluye entradas, salidas, puntos medios, pozos y cauces consolidados. Para Río Paraguay se clasifica FW01-PY como Entrada, FW02-PY como Medio y FW03-PY como Salida.",
  },
  parameters: {
    title: "Parámetros",
    text: "Los nombres fueron normalizados para evitar duplicados por acentos, abreviaturas o variantes como Conductividad/Conductividad eléctrica. La fuente original queda visible en trazabilidad.",
  },
  deviation: {
    title: "Límite de desviación",
    text: "La alerta usa el cambio contra línea de base dividido por la desviación estándar cuando existe. Es una señal de revisión, no una conclusión causal. Valores con DE igual a cero o sin DE no generan puntaje de desviación.",
  },
  chart: {
    title: "Gráfico de evolución",
    text: "Si se selecciona un solo parámetro, el gráfico usa valores reales. Si hay varios parámetros con unidades distintas, se normaliza cada serie a base 100 para comparar tendencia sin mezclar unidades.",
  },
  reading: {
    title: "Lectura rápida",
    text: "Resume cobertura, comparabilidad y alertas del filtro actual. Sirve como diagnóstico antes de interpretar tendencias o preparar un informe.",
  },
  matrix: {
    title: "Matriz de evolución",
    text: "Permite revisar valores, n, desviación estándar y diferencia frente a línea de base. Es útil para detectar qué registros merecen revisión estadística o documental.",
  },
  compatibility: {
    title: "Compatibilidad de puntos",
    text: "Los puntos cambiaron entre años. Por eso se separa cobertura simple de comparabilidad estadística. Un punto puede tener datos en varios años y aun así no ser comparable si n es insuficiente.",
  },
  statistics: {
    title: "Demostración estadística",
    text: "El informe aplica Shapiro-Wilk para normalidad, ANOVA si la distribución es compatible con normalidad y Kruskal-Wallis para datos no paramétricos. p<0,05 indica diferencia estadísticamente significativa.",
  },
  source: {
    title: "Trazabilidad",
    text: "La columna fuente muestra archivo, hoja y fila del anexo usado. Esto permite revisar cálculos de la consultora y corregir la capa normalizada si se detecta una interpretación de tabla que deba ajustarse.",
  },
  edit: {
    title: "Edición segura",
    text: "El modo edición no modifica anexos ni Google Sheet. Guarda cambios en el navegador y permite exportar un JSON de ajustes para aplicar después con control de calidad.",
  },
  auth: {
    title: "Acceso y auditoria",
    text: "Cada responsable crea su usuario una sola vez. La contrasena no se guarda como texto: el backend conserva un hash salteado en el libro en linea y usa sesiones temporales para registrar cargas y cambios.",
  },
  capture: {
    title: "Carga de nuevas mediciones",
    text: "La carga genera una fila operativa por punto, ano y temporada. Los parametros vacios no se interpretan como cero; quedan vacios para no crear datos falsos.",
  },
  audit: {
    title: "Auditoria de cambios",
    text: "Cada envio queda asociado a usuario, fecha, accion, punto, periodo y resumen. Esto permite saber quien cargo o corrigio informacion sin abrir el libro a edicion general.",
  },
  rio: {
    title: "Río Paraguay",
    text: "Esta vista concentra los datos vinculados al Río Paraguay. La fuente principal es el libro de resultados compilados con hoja Comparación puntos_muestreo; también se listan anexos de Kruskal-Wallis, Shapiro y pesticidas asociados.",
  },
  nMetric: {
    title: "n · cantidad de observaciones",
    text: "n indica cuántos datos sostienen un valor. Un n bajo reduce representatividad y obliga a leer el resultado como señal preliminar.",
  },
  valueMetric: {
    title: "Valor mostrado",
    text: "El valor corresponde al promedio cuando existe, a la mediana cuando es lo más robusto disponible o al promedio calculado desde campañas individuales.",
  },
  sdMetric: {
    title: "DE · desviación estándar",
    text: "La desviación estándar muestra dispersión. Una DE alta indica variabilidad y exige cautela antes de concluir que un cambio es relevante.",
  },
  baseline: {
    title: "Base 2021 / 2023",
    text: "La app calcula referencias frente a 2021 y 2023 cuando existen datos del mismo punto y parámetro. 2021 sirve como línea histórica y 2023 como referencia reciente.",
  },
  deltaBase: {
    title: "Δ frente a base",
    text: "Es la diferencia porcentual frente a la línea de base. Debe interpretarse junto con n, DE, comparabilidad del punto y prueba estadística.",
  },
  status: {
    title: "Estado comparable / referencial",
    text: "Comparable significa que hay soporte mínimo para contrastar. Referencial significa que el dato ayuda a observar, pero no alcanza para conclusión estadística sólida.",
  },
  representativeness: {
    title: "Representatividad",
    text: "Resume si la cantidad de datos permite inferir con confianza. Muestras pequeñas requieren pruebas no paramétricas, exactas o por permutación y lectura cautelosa.",
  },
  pValue: {
    title: "p-valor",
    text: "p<0,05 indica diferencia estadísticamente significativa bajo el test aplicado. No explica causa, solo indica que los grupos difieren estadísticamente.",
  },
  hStat: {
    title: "H de Kruskal-Wallis",
    text: "H es el estadístico de Kruskal-Wallis, usado para comparar varios grupos cuando no se asume normalidad o hay muestras pequeñas/no paramétricas.",
  },
  testType: {
    title: "Tipo de prueba",
    text: "Shapiro-Wilk evalúa normalidad; ANOVA compara medias si la normalidad es compatible; Kruskal-Wallis compara grupos sin exigir distribución normal; Tukey identifica pares distintos.",
  },
  sourceHelp: {
    title: "Fuente y trazabilidad",
    text: "La fuente indica archivo, hoja y fila del anexo. Esto permite auditar el dato, revisar cálculos de consultora y corregir la normalización si aparece una lectura distinta.",
  },
  colorHelp: {
    title: "Color de pestaña / tipo de punto",
    text: "La regla del proyecto es rojo=entrada, verde=salida y amarillo=intermedio. Si el color no está preservado localmente, la app muestra la clasificación operativa equivalente.",
  },
  approachHelp: {
    title: "Enfoques",
    text: "Por Campaña, En el Tiempo y Evolución del Programa son lecturas complementarias. Combinarlas ayuda a separar seguimiento puntual de tendencia y madurez del monitoreo.",
  },
};

const pointTypes = ["Entrada", "Medio", "Salida", "Pozo", "No clasificado", "Sin clasificar"];
const colors = ["#177346", "#b8423f", "#2f6fa3", "#d6a728", "#6b5aa6", "#00837a", "#c2682f", "#61727a"];
const overrideKey = "paracel-water-overrides-v1";
const authStorageKey = "paracel-water-auth-v1";
const pendingCaptureKey = "paracel-water-pending-captures-v1";
const apiUrlStorageKey = "paracel-water-api-url-v1";
const defaultApiUrl = "https://script.google.com/macros/s/AKfycbx_nVf5X3Y1VBsfMXWmFLxFmS4Xl8YuJtBB28wmtdHKZfE1T-b2HDhuZoMX76s_b0NS4w/exec";
const apiUrl = window.PARACEL_WATER_API_URL || localStorage.getItem(apiUrlStorageKey) || defaultApiUrl;
const captureParameters = [
  { key: "Temperatura", label: "Temperatura" },
  { key: "Color", label: "Color" },
  { key: "pH", label: "pH" },
  { key: "Conductividad", label: "Conductividad" },
  { key: "OD", label: "Oxigeno disuelto" },
  { key: "Turbidez", label: "Turbidez" },
  { key: "Mat_Flotantes", label: "Materiales flotantes" },
  { key: "TDS", label: "TDS" },
  { key: "Aceites_Grasas", label: "Aceites y grasas" },
  { key: "DBO5", label: "DBO5" },
  { key: "Fosforo_Total", label: "Fosforo total" },
  { key: "Nitrogeno_Total", label: "Nitrogeno total" },
  { key: "Nitratos", label: "Nitratos" },
  { key: "Amoniaco", label: "Amoniaco" },
  { key: "Nitritos", label: "Nitritos" },
  { key: "Aluminio", label: "Aluminio" },
  { key: "Hierro_Soluble", label: "Hierro soluble" },
  { key: "Clorofila_A", label: "Clorofila A" },
  { key: "Calcio", label: "Calcio" },
  { key: "Potasio", label: "Potasio" },
  { key: "SST", label: "SST" },
  { key: "Magnesio", label: "Magnesio" },
  { key: "Coliformes_Totales", label: "Coliformes totales" },
  { key: "Coliformes_Fecales", label: "Coliformes fecales" },
  { key: "E_coli", label: "E. coli" },
  { key: "Glifosato", label: "Glifosato" },
  { key: "AMPA", label: "AMPA" },
  { key: "Tebuconazole", label: "Tebuconazole" },
  { key: "Sulfluramida", label: "Sulfluramida" },
  { key: "Glufosinato", label: "Glufosinato" },
  { key: "Flumioxazin", label: "Flumioxazin" },
  { key: "Fipronil", label: "Fipronil" },
  { key: "Isoxaflutole", label: "Isoxaflutole" },
  { key: "Haloxifop", label: "Haloxifop" },
];

let overrides = loadOverrides();
let authState = loadAuthState();
let activeView = "dashboard";
let mapMode = "all";

const dom = {
  componentFilter: document.querySelector("#componentFilter"),
  mediumFilter: document.querySelector("#mediumFilter"),
  waterBodyFilter: document.querySelector("#waterBodyFilter"),
  pointTypeFilter: document.querySelector("#pointTypeFilter"),
  parameterFilter: document.querySelector("#parameterFilter"),
  pointFilter: document.querySelector("#pointFilter"),
  yearFilter: document.querySelector("#yearFilter"),
  approachFilter: document.querySelector("#approachFilter"),
  flowFilter: document.querySelector("#flowFilter"),
  comparableOnly: document.querySelector("#comparableOnly"),
  deviationLimit: document.querySelector("#deviationLimit"),
  deviationLabel: document.querySelector("#deviationLabel"),
};

const series = applyOverrides(DATA.series || []);
const pointCatalog = buildPointCatalog(series);
const parameterCatalog = DATA.parameter_catalog || [];
const tests = DATA.statistical_tests || [];
const legacyPoints = [
  { id: "FW 104-ZA", sub: "Negla", lat: -22.34, lng: -56.55 },
  { id: "FW 190-ST", sub: "Negla", lat: -22.44, lng: -56.62 },
  { id: "FW 320-ST", sub: "Negla", lat: -22.52, lng: -56.69 },
  { id: "FW 191-ST", sub: "Napegue", lat: -22.43, lng: -56.49 },
  { id: "FW 391-ST", sub: "Napegue", lat: -22.52, lng: -56.58 },
  { id: "FW 102-SL", sub: "Trementina", lat: -22.44, lng: -56.9 },
  { id: "FW 208-TR", sub: "Trementina", lat: -22.6, lng: -56.86 },
  { id: "FW 109-MYRZ", sub: "Trementina", lat: -22.69, lng: -56.92 },
  { id: "FW 113-RC", sub: "Trementina", lat: -22.64, lng: -56.98 },
  { id: "FW 317-RZ", sub: "Trementina", lat: -22.84, lng: -56.97 },
  { id: "FW 107-HE", sub: "Hermosa", lat: -22.32, lng: -56.94 },
  { id: "FW 322-HE", sub: "Hermosa", lat: -22.25, lng: -56.85 },
  { id: "FW 210-ZM", sub: "Zapiquem", lat: -22.47, lng: -57.07 },
  { id: "FW 130-SO", sub: "Itasilla", lat: -22.46, lng: -57.11 },
  { id: "FW 230-VS", sub: "Pitanohaga", lat: -22.6, lng: -57.1 },
  { id: "FW 318-VS", sub: "Pitanohaga", lat: -22.72, lng: -57.13 },
  { id: "FW 316-CR", sub: "Aquidaban", lat: -22.98, lng: -57.14 },
  { id: "FW 321-CR", sub: "Aquidaban", lat: -22.99, lng: -57.12 },
  { id: "FW 106-DG", sub: "Pitanohaga", lat: -22.8, lng: -57.3 },
  { id: "FW 326-DG", sub: "Pitanohaga", lat: -22.85, lng: -57.35 },
];
const legacyHistorical = [
  { anio: 2021, temp: "RS", nPuntos: 18, dl: 698, fl: 76, total: 774, pct: 90.18 },
  { anio: 2021, temp: "DS", nPuntos: 14, dl: 556, fl: 46, total: 602, pct: 92.36 },
  { anio: 2022, temp: "RS", nPuntos: 12, dl: 462, fl: 54, total: 516, pct: 89.53 },
  { anio: 2022, temp: "DS", nPuntos: 11, dl: 422, fl: 51, total: 473, pct: 89.22 },
  { anio: 2023, temp: "RS", nPuntos: 17, dl: 617, fl: 114, total: 731, pct: 84.4 },
  { anio: 2023, temp: "DS", nPuntos: 19, dl: 749, fl: 68, total: 817, pct: 91.68 },
  { anio: 2024, temp: "RS", nPuntos: 16, dl: 171, fl: 53, total: 224, pct: 76.34 },
  { anio: 2024, temp: "DS", nPuntos: 16, dl: 168, fl: 88, total: 256, pct: 65.63 },
  { anio: 2025, temp: "RS", nPuntos: 20, dl: 242, fl: 98, total: 340, pct: 71.18 },
  { anio: 2025, temp: "DS", nPuntos: 20, dl: 258, fl: 62, total: 320, pct: 80.63 },
];
const legacyParamLimits = {
  pH: [6, 9],
  OD: [5, null],
  Turbidez: [null, 100],
  DBO5: [null, 5],
  Fosforo_Total: [null, 0.05],
  Nitrogeno_Total: [null, 0.6],
  Nitratos: [null, 10],
  Amoniaco: [null, 0.02],
  Nitritos: [null, 1],
  Aluminio: [null, 0.2],
  Hierro_Soluble: [null, 0.3],
  Coliformes_Fecales: [null, 1000],
};
let legacyRecords = [];
let legacyLoaded = false;

init();

function init() {
  populateFilters();
  buildChoiceControls();
  initCaptureModule();
  bindEvents();
  renderGuide();
  const requestedView = new URLSearchParams(window.location.search).get("view") || window.location.hash.replace("#", "");
  if (requestedView && document.getElementById(requestedView)) setView(requestedView);
  else renderAll();
  loadLegacyData();
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  Object.values(dom).forEach((element) => {
    if (element) element.addEventListener("change", handleFilterChange);
  });
  dom.deviationLimit.addEventListener("input", () => {
    dom.deviationLabel.textContent = `±${dom.deviationLimit.value} DE`;
    renderAll();
  });
  document.querySelector("#clearFilters").addEventListener("click", clearFilters);
  document.querySelector("#quickIron").addEventListener("click", () => selectParameter("hierro_soluble"));
  document.querySelector("#quickRio").addEventListener("click", selectRioParaguay);
  document.querySelector("#forceRioView").addEventListener("click", selectRioParaguay);
  document.querySelector("#sideCampaign").addEventListener("click", () => selectApproach("Enfoque 1 · Por Campaña"));
  document.querySelector("#sideTime").addEventListener("click", () => selectApproach("Enfoque 2 · En el Tiempo"));
  document.querySelector("#sideProgram").addEventListener("click", () => selectApproach("Enfoque 3 · Evolución del Programa"));
  document.querySelector("#exportFilteredCsv").addEventListener("click", () => downloadCsv(filteredSeries(), "monitoreo_agua_filtrado.csv"));
  document.querySelector("#exportDatasetJson").addEventListener("click", () => downloadJson(filteredSeries(), "monitoreo_agua_vista.json"));
  document.querySelector("#downloadOverrides").addEventListener("click", () => downloadJson(overrides, "ajustes_monitoreo_agua.json"));
  document.querySelector("#resetOverrides").addEventListener("click", resetOverrides);
  document.querySelector("#legacyMapFilter")?.addEventListener("change", renderLegacyDashboard);
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
  });
  document.querySelector("#loginForm")?.addEventListener("submit", handleLogin);
  document.querySelector("#registerForm")?.addEventListener("submit", handleRegister);
  document.querySelector("#requestResetCode")?.addEventListener("click", requestResetCode);
  document.querySelector("#recoverForm")?.addEventListener("submit", handlePasswordReset);
  document.querySelector("#captureForm")?.addEventListener("submit", handleCaptureSubmit);
  document.querySelector("#capturePoint")?.addEventListener("change", syncCapturePointMeta);
  document.querySelector("#clearCaptureValues")?.addEventListener("click", clearCaptureParameterValues);
  document.querySelector("#refreshAudit")?.addEventListener("click", refreshAuditTable);
  document.querySelectorAll("[data-map-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      mapMode = button.dataset.mapMode || "all";
      document.querySelectorAll("[data-map-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
      renderLiveMap(filteredSeries());
    });
  });
  document.querySelector("#closeNote").addEventListener("click", () => {
    document.querySelector("#notePanel").hidden = true;
  });
  wireInfoButtons(document);
}

function handleFilterChange(event) {
  if (event.currentTarget === dom.waterBodyFilter) {
    alignParentsToWaterBody();
    clearMulti(dom.pointFilter);
  } else if ([dom.componentFilter, dom.mediumFilter].includes(event.currentTarget)) {
    dom.waterBodyFilter.value = "";
    clearMulti(dom.pointFilter);
  }
  renderAll();
}

function alignParentsToWaterBody() {
  const waterBody = dom.waterBodyFilter.value;
  if (!waterBody) return;
  const matches = series.filter((row) => row.water_body === waterBody);
  const components = unique(matches.map((row) => row.component));
  const media = unique(matches.map((row) => row.medium));
  if (components.length === 1) dom.componentFilter.value = components[0];
  if (media.length === 1) dom.mediumFilter.value = media[0];
}

function setView(view) {
  activeView = view;
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  document.querySelectorAll(".view").forEach((section) => section.classList.toggle("is-active", section.id === view));
  renderAll();
}

function showNote(key) {
  const note = notes[key];
  if (!note) return;
  document.querySelector("#noteTitle").textContent = `(i) ${note.title}`;
  document.querySelector("#noteText").textContent = note.text;
  document.querySelector("#notePanel").hidden = false;
}

function wireInfoButtons(root = document) {
  root.querySelectorAll(".info").forEach((button) => {
    if (button.dataset.bound === "1") return;
    button.dataset.bound = "1";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showNote(button.dataset.note);
    });
  });
}

function noteHeader(label, noteKey) {
  return `${label} <button class="info inline-note" data-note="${noteKey}">(i)</button>`;
}

function populateFilters() {
  fillSingle(dom.componentFilter, unique(series.map((row) => row.component)), "Todos");
  fillSingle(dom.mediumFilter, unique(series.map((row) => row.medium)), "Todos");
  fillSingle(dom.waterBodyFilter, unique(series.map((row) => row.water_body)), "Todos");
  fillSingle(dom.pointTypeFilter, unique(series.map((row) => row.point_type)), "Todos");
  fillMultiple(dom.parameterFilter, parameterCatalog.map((row) => ({ value: row.parameter_key, label: row.parameter })));
  fillMultiple(dom.pointFilter, pointCatalog.map((row) => ({ value: pointId(row), label: `${row.point} · ${row.water_body}` })));
  fillMultiple(dom.yearFilter, (DATA.summary?.years || []).map((year) => ({ value: String(year), label: String(year) })));
  fillMultiple(dom.approachFilter, (DATA.filters?.approaches || []).map((value) => ({ value, label: value })));
  fillSingle(dom.flowFilter, DATA.filters?.flow_types || pointTypes, "Todos");
  selectValues(dom.parameterFilter, ["hierro_soluble"]);
  dom.componentFilter.value = "Industrial";
  dom.mediumFilter.value = "Agua superficial";
  dom.waterBodyFilter.value = "Río Paraguay";
  const rioPoints = pointCatalog.filter((row) => row.water_body === "Río Paraguay").map(pointId);
  selectValues(dom.pointFilter, rioPoints);
}

function buildChoiceControls() {
  [
    { select: dom.waterBodyFilter, target: "#waterBodyChoices" },
    { select: dom.parameterFilter, target: "#parameterChoices", clearLabel: "Todos" },
    { select: dom.yearFilter, target: "#yearChoices", clearLabel: "Todos" },
    { select: dom.pointFilter, target: "#pointChoices", clearLabel: "Todos" },
    { select: dom.componentFilter, target: "#componentChoices" },
    { select: dom.mediumFilter, target: "#mediumChoices" },
    { select: dom.pointTypeFilter, target: "#pointTypeChoices" },
    { select: dom.approachFilter, target: "#approachChoices", clearLabel: "Todos" },
    { select: dom.flowFilter, target: "#flowChoices" },
    { select: document.querySelector("#legacyMapFilter"), target: "#legacyMapChoices" },
  ].forEach(renderChoiceControl);
  syncChoiceControls();
}

function renderChoiceControl(config) {
  const select = config.select;
  const root = document.querySelector(config.target);
  if (!select || !root) return;
  const buttons = [];
  if (select.multiple) {
    buttons.push(`<button type="button" class="choice-pill" data-choice="${escapeAttr(select.id)}" data-value="">${escapeHtml(config.clearLabel || "Todos")}</button>`);
  }
  [...select.options].forEach((option) => {
    if (select.multiple && !option.value) return;
    buttons.push(`<button type="button" class="choice-pill" data-choice="${escapeAttr(select.id)}" data-value="${escapeAttr(option.value)}">${escapeHtml(choiceLabel(option.textContent || option.label || option.value))}</button>`);
  });
  root.innerHTML = buttons.join("");
  root.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => activateChoice(button));
  });
}

function activateChoice(button) {
  const select = document.getElementById(button.dataset.choice);
  if (!select) return;
  const value = button.dataset.value || "";
  if (select.multiple) {
    if (!value) {
      clearMulti(select);
    } else {
      const option = [...select.options].find((item) => item.value === value);
      if (option) option.selected = !option.selected;
    }
  } else {
    select.value = value;
  }
  syncChoiceControls();
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function syncChoiceControls() {
  document.querySelectorAll("[data-choice]").forEach((button) => {
    const select = document.getElementById(button.dataset.choice);
    if (!select) return;
    const value = button.dataset.value || "";
    const selected = select.multiple
      ? (!value && selectedValues(select).length === 0) || selectedValues(select).includes(value)
      : select.value === value;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}

function choiceLabel(label) {
  return String(label || "").replace(/^Enfoque \d+\s*·\s*/i, "");
}

function fillSingle(select, values, allLabel) {
  select.innerHTML = "";
  select.append(new Option(allLabel, ""));
  values.forEach((value) => select.append(new Option(value, value)));
}

function fillMultiple(select, options) {
  select.innerHTML = "";
  options.forEach((item) => select.append(new Option(item.label, item.value)));
}

function getFilters() {
  return {
    component: dom.componentFilter.value,
    medium: dom.mediumFilter.value,
    waterBody: dom.waterBodyFilter.value,
    pointType: dom.pointTypeFilter.value,
    flow: dom.flowFilter.value,
    parameters: selectedValues(dom.parameterFilter),
    points: selectedValues(dom.pointFilter),
    years: selectedValues(dom.yearFilter).map(Number),
    approaches: selectedValues(dom.approachFilter),
    comparableOnly: dom.comparableOnly.checked,
    deviationLimit: Number(dom.deviationLimit.value),
  };
}

function filteredSeries() {
  const filters = getFilters();
  return series.filter((row) => {
    if (filters.component && row.component !== filters.component) return false;
    if (filters.medium && row.medium !== filters.medium) return false;
    if (filters.waterBody && row.water_body !== filters.waterBody) return false;
    if (filters.pointType && row.point_type !== filters.pointType) return false;
    if (filters.flow && row.point_type !== filters.flow) return false;
    if (filters.approaches.length && !filters.approaches.some((item) => (row.approaches || []).includes(item))) return false;
    if (filters.parameters.length && !filters.parameters.includes(row.parameter_key)) return false;
    if (filters.points.length && !filters.points.includes(rowPointId(row))) return false;
    if (filters.years.length) {
      const years = new Set([row.year, ...(row.period_years || [])].filter(Boolean).map(Number));
      if (!filters.years.some((year) => years.has(year))) return false;
    }
    if (filters.comparableOnly && !row.comparable) return false;
    return true;
  });
}

function filteredTests() {
  const filters = getFilters();
  return tests.filter((row) => {
    if (filters.component && row.component !== filters.component) return false;
    if (filters.medium && row.medium !== filters.medium) return false;
    if (filters.waterBody && row.water_body !== filters.waterBody) return false;
    if (filters.parameters.length && !filters.parameters.includes(row.parameter_key)) return false;
    if (filters.flow && classifyFlowFromGroup(row.group) !== filters.flow) return false;
    if (filters.approaches.length && !filters.approaches.some((item) => testApproaches(row).includes(item))) return false;
    return true;
  });
}

function renderAll() {
  document.body.dataset.view = activeView;
  const rows = filteredSeries();
  renderFilterSummary(rows);
  renderMetrics(rows);
  renderAnalystBrief(rows);
  renderChart(rows);
  renderSummaryFigures(rows);
  renderLiveMap(rows);
  renderReading(rows);
  renderAlerts(rows);
  if (activeView === "evolution") {
    renderEvolutionTable(rows);
    renderEvolutionDetailTable(rows);
  }
  if (activeView === "rio") {
    renderRioParaguay(rows);
    renderRioDetailTable(rows);
  }
  if (activeView === "compatibility") {
    renderCompatibilityTable();
    renderCompatibilityDetailTable();
    renderStatTests();
  }
  if (activeView === "data") {
    renderDataTable(rows);
    renderDataDetailTable(rows);
  }
  if (activeView === "capture") renderCaptureView();
  if (activeView === "legacy") renderLegacyDashboard();
  if (activeView === "edit") renderEditTable();
  syncChoiceControls();
}

function renderMetrics(rows) {
  const alerts = flaggedRows(rows);
  setText("#metricSeries", formatInt(rows.length));
  setText("#metricSeriesSub", `${formatInt(rows.filter((row) => row.comparable).length)} comparables`);
  setText("#metricPoints", formatInt(unique(rows.map((row) => rowPointId(row))).length));
  setText("#metricParams", formatInt(unique(rows.map((row) => row.parameter_key)).length));
  setText("#metricAlerts", formatInt(alerts.length));
}

function renderFilterSummary(rows) {
  const root = document.querySelector("#activeFilterSummary");
  if (!root) return;
  const pointCount = unique(rows.map((row) => rowPointId(row))).length;
  const paramCount = unique(rows.map((row) => row.parameter_key)).length;
  root.innerHTML = `<strong>Filtro activo</strong>
    <span><b>Sistema:</b> ${escapeHtml(selectedLabel(dom.waterBodyFilter) || "Todos")}</span>
    <span><b>Parámetros:</b> ${escapeHtml(selectedLabels(dom.parameterFilter, 2) || "Todos")} (${formatInt(paramCount)} en datos)</span>
    <span><b>Puntos:</b> ${escapeHtml(selectedLabels(dom.pointFilter, 1) || "Todos")} (${formatInt(pointCount)} visibles)</span>
    <span><b>Años:</b> ${escapeHtml(selectedLabels(dom.yearFilter, 3) || "Todos")}</span>`;
}

function renderAnalystBrief(rows) {
  const root = document.querySelector("#analystBrief");
  if (!root) return;
  if (!rows.length) {
    root.innerHTML = analystCard("Sin datos", "El filtro actual no devuelve registros. Abra el panel lateral y quite puntos, años o parámetros hasta recuperar cobertura.", "No conviene interpretar una vista vacía.", "warning");
    return;
  }

  const points = unique(rows.map((row) => rowPointId(row))).length;
  const parameters = unique(rows.map((row) => row.parameter_key)).length;
  const years = unique(rows.map((row) => row.year).filter((year) => Number.isFinite(Number(year))));
  const comparable = rows.filter((row) => row.comparable).length;
  const comparableRatio = comparable / Math.max(1, rows.length);
  const alerts = flaggedRows(rows);
  const strongestChange = rows
    .filter((row) => numeric(row.delta_pct_vs_baseline) && numeric(row.value))
    .sort((a, b) => Math.abs(b.delta_pct_vs_baseline) - Math.abs(a.delta_pct_vs_baseline))[0];
  const topAlert = alerts[0];
  const flow = countBy(rows, (row) => row.point_type || "Sin clasificar").slice(0, 3);
  const flowText = flow.map((item) => `${item.label}: ${formatInt(item.value)}`).join(" · ") || "sin clasificación";
  const qualityClass = comparableRatio >= 0.75 ? "" : comparableRatio >= 0.4 ? "caution" : "warning";
  const qualityText =
    comparableRatio >= 0.75
      ? "La selección tiene buena base comparativa para lectura de tendencia."
      : comparableRatio >= 0.4
        ? "La selección mezcla evidencia comparable con registros referenciales; conviene confirmar n y años."
        : "La selección es principalmente referencial; usar como señal exploratoria, no como demostración estadística.";
  const changeText = strongestChange
    ? `${strongestChange.parameter} en ${strongestChange.point}: ${formatPercent(strongestChange.delta_pct_vs_baseline)} frente a base ${strongestChange.baseline_year || "histórica"}.`
    : "No hay delta calculado para la selección actual.";
  const alertText = topAlert
    ? `${topAlert.parameter} en ${topAlert.point}: ${formatNumber(topAlert.deviation_score)} DE. Revisar fuente, n y consistencia temporal.`
    : "No hay parámetros fuera del umbral de desviación definido.";

  root.innerHTML = [
    analystCard("Cobertura", `${points} punto(s), ${parameters} parámetro(s), ${years.length || "sin"} año(s).`, `Periodos: ${years.join(", ") || "no identificados"}.`, points >= 3 ? "" : "caution"),
    analystCard("Calidad de comparación", `${formatPercent(comparableRatio)} de las series filtradas son comparables.`, qualityText, qualityClass),
    analystCard("Señal principal", changeText, "Ordenado por cambio porcentual absoluto contra la línea de base disponible.", strongestChange ? "info-card" : "caution"),
    analystCard("Alerta técnica", alertText, `Composición por tipo: ${flowText}.`, topAlert ? "warning" : ""),
  ].join("");
}

function analystCard(title, value, note, cls = "") {
  return `<article class="analyst-card ${escapeAttr(cls)}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(value)}</span><small>${escapeHtml(note)}</small></article>`;
}

function renderSummaryFigures(rows) {
  renderBarFigure(
    "#pointTypeFigure",
    countBy(rows, (row) => row.point_type || "Sin clasificar").slice(0, 8),
    "serie(s)",
  );
  renderYearFigure(rows);
  renderBarFigure(
    "#parameterFigure",
    countBy(rows, (row) => row.parameter || "Sin parametro").slice(0, 8),
    "registro(s)",
  );
}

function renderBarFigure(selector, items, suffix) {
  const root = document.querySelector(selector);
  if (!root) return;
  if (!items.length) {
    root.innerHTML = `<div class="empty-figure">Sin datos para el filtro actual.</div>`;
    return;
  }
  const max = Math.max(...items.map((item) => item.value), 1);
  root.innerHTML = items
    .map((item) => {
      const width = Math.max(4, Math.round((item.value / max) * 100));
      return `<div class="bar-row"><span>${escapeHtml(item.label)}</span><div class="bar-track"><i style="width:${width}%"></i></div><strong>${formatInt(item.value)}</strong><small>${suffix}</small></div>`;
    })
    .join("");
}

function renderYearFigure(rows) {
  const root = document.querySelector("#yearFigure");
  if (!root) return;
  const years = unique(rows.map((row) => row.year).filter((year) => Number.isFinite(Number(year))));
  if (!years.length) {
    root.innerHTML = `<div class="empty-figure">Sin anios comparables para el filtro actual.</div>`;
    return;
  }
  root.innerHTML = years
    .map((year) => {
      const yearRows = rows.filter((row) => Number(row.year) === Number(year));
      const comparable = yearRows.filter((row) => row.comparable).length;
      const referential = Math.max(0, yearRows.length - comparable);
      const total = Math.max(1, yearRows.length);
      const compWidth = Math.round((comparable / total) * 100);
      const refWidth = 100 - compWidth;
      return `<div class="stack-row"><span>${escapeHtml(year)}</span><div class="stack-track"><i class="ok" style="width:${compWidth}%"></i><i class="ref" style="width:${refWidth}%"></i></div><strong>${formatInt(comparable)}/${formatInt(total)}</strong></div>`;
    })
    .join("");
}

function renderLiveMap(rows) {
  const root = document.querySelector("#liveMap");
  const story = document.querySelector("#mapStory");
  if (!root || !story) return;
  const points = buildLiveMapPoints(rows);
  const visible = points.filter((point) => {
    if (mapMode === "alerts") return point.alerts > 0;
    if (mapMode === "comparable") return point.comparable_records > 0;
    if (mapMode === "flow") return ["Entrada", "Medio", "Salida"].includes(point.point_type);
    return true;
  });
  if (!points.length) {
    root.innerHTML = `<div class="empty-figure">Sin puntos para el filtro actual.</div>`;
    story.innerHTML = mapStoryCard("Sin cobertura", "Ajuste los botones de filtros para volver a mostrar puntos.");
    return;
  }

  if (GIS_MAP?.features?.length) {
    renderRealGisMap(root, story, points, visible);
    return;
  }

  const width = 1100;
  const height = 520;
  root.innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-label="Mapa de monitoreo filtrado">
    <defs>
      <linearGradient id="riverGradient" x1="0" x2="1">
        <stop offset="0" stop-color="#8cc6df"></stop>
        <stop offset="1" stop-color="#2f6fa3"></stop>
      </linearGradient>
    </defs>
    <rect class="live-map-bg" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18"></rect>
    <path class="map-land" d="M45 420 C210 370 280 300 430 330 C600 365 700 250 865 288 C990 318 1035 235 1060 195 L1060 490 L45 490 Z"></path>
    <path class="map-river main" d="M930 42 C865 118 892 171 824 236 C749 307 773 382 710 466"></path>
    <path class="map-river secondary" d="M118 385 C228 330 286 248 410 265 C520 280 574 206 690 205"></path>
    <path class="map-river secondary" d="M145 145 C282 178 322 122 456 154 C594 187 617 124 740 145"></path>
    <text class="map-water-label" x="870" y="64">Río Paraguay</text>
    <text class="map-water-label" x="185" y="356">red de arroyos</text>
    ${visible
      .map((point) => {
        const fill = point.alerts > 0 && mapMode === "alerts" ? "#c1423b" : flowColor(point.point_type);
        const radius = Math.min(10, 4.5 + Math.sqrt(point.records) * 0.75);
        const pulse = point.alerts > 0 ? " alert" : "";
        const label = `${point.point} | ${point.water_body} | ${point.point_type || "Sin clasificar"} | ${formatInt(point.records)} registros`;
        return `<g class="live-point${pulse}" ${mapPointAttrs(point)} tabindex="0" role="button" aria-label="Filtrar punto ${escapeAttr(label)}">
          <circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${escapeAttr(fill)}"><title>${escapeHtml(label)}</title></circle>
          <text x="${point.x + radius + 5}" y="${point.y + 3}">${escapeHtml(point.point)}</text>
        </g>`;
      })
      .join("")}
  </svg><div class="map-hover-card" hidden></div>`;
  wireMapPointInteractions(root);

  const alertPoints = points.filter((point) => point.alerts > 0).length;
  const comparablePoints = points.filter((point) => point.comparable_records > 0).length;
  const bodies = unique(points.map((point) => point.water_body)).length;
  const flowSummary = countBy(points, (point) => point.point_type || "Sin clasificar").slice(0, 4);
  story.innerHTML = [
    mapStoryCard("Puntos visibles", `${visible.length} de ${points.length} dentro del filtro actual.`),
    mapStoryCard("Cauces/sistemas", `${bodies} sistemas representados en el mapa.`),
    mapStoryCard("Alertas territoriales", alertPoints ? `${alertPoints} punto(s) con desvíos a revisar.` : "Sin puntos con alerta en el filtro."),
    mapStoryCard("Comparabilidad", `${Math.round((comparablePoints / Math.max(1, points.length)) * 100)}% de los puntos tiene registros comparables.`),
    `<div class="map-story-card flow-card"><strong>Composición</strong>${flowSummary.map((item) => `<span><i style="background:${escapeAttr(flowColor(item.label))}"></i>${escapeHtml(item.label)} · ${formatInt(item.value)}</span>`).join("")}</div>`,
  ].join("");
}

function renderRealGisMap(root, story, points, visible) {
  const width = 1100;
  const height = 560;
  const margin = 26;
  const bbox = GIS_MAP.bbox;
  const minX = bbox[0];
  const minY = bbox[1];
  const maxX = bbox[2];
  const maxY = bbox[3];
  const xScale = (value) => margin + ((value - minX) / (maxX - minX || 1)) * (width - margin * 2);
  const yScale = (value) => margin + (1 - (value - minY) / (maxY - minY || 1)) * (height - margin * 2);
  const project = (point) => [xScale(point[0]), yScale(point[1])];
  const featureOrder = { districts: 1, localities_amambay: 2, hydrology: 2.5, communities: 3, components: 4 };
  const features = [...GIS_MAP.features].sort((a, b) => (featureOrder[a.layer] || 9) - (featureOrder[b.layer] || 9));
  const labels = features
    .filter((feature) => feature.layer === "components")
    .map((feature) => {
      const [x, y] = project(feature.center);
      return `<text class="gis-component-label" x="${x}" y="${y}">${escapeHtml(feature.code || feature.label)}</text>`;
    })
    .join("");
  const waterLabels = buildWaterLabels(features, project, { width, height, margin });
  root.innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-label="Mapa GIS PARACEL">
    <rect class="gis-bg" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18"></rect>
    ${features.map((feature) => `<path class="${featureClass(feature)}" d="${featurePath(feature, project)}"><title>${escapeHtml(featureLayerLabel(feature.layer))}: ${escapeHtml(feature.label)}</title></path>`).join("")}
    ${labels}
    ${waterLabels}
    ${visible
      .map((point, index) => {
        const pos = realPointPosition(point, index, points);
        const [px, py] = project([pos.x, pos.y]);
        const fill = point.alerts > 0 && mapMode === "alerts" ? "#c1423b" : flowColor(point.point_type);
        const radius = Math.min(9, 4.2 + Math.sqrt(point.records) * 0.7);
        const pulse = point.alerts > 0 ? " alert" : "";
        const label = `${point.point} | ${point.water_body} | ${point.point_type || "Sin clasificar"} | ${formatInt(point.records)} registros`;
        return `<g class="live-point real${pulse}" ${mapPointAttrs(point)} tabindex="0" role="button" aria-label="Filtrar punto ${escapeAttr(label)}">
          <circle cx="${px}" cy="${py}" r="${radius}" fill="${escapeAttr(fill)}"><title>${escapeHtml(label)}</title></circle>
          <text x="${px + radius + 5}" y="${py + 3}">${escapeHtml(point.point)}</text>
        </g>`;
      })
      .join("")}
    <text class="gis-source-label" x="${margin}" y="${height - 18}">Base GIS PARACEL + hidrografía · ${formatInt(GIS_MAP.features.length)} entidades simplificadas</text>
  </svg><div class="map-hover-card" hidden></div>`;
  wireMapPointInteractions(root);

  const alertPoints = points.filter((point) => point.alerts > 0).length;
  const comparablePoints = points.filter((point) => point.comparable_records > 0).length;
  const bodies = unique(points.map((point) => point.water_body)).length;
  const flowSummary = countBy(points, (point) => point.point_type || "Sin clasificar").slice(0, 4);
  story.innerHTML = [
    mapStoryCard("Base GIS real", "Capa simplificada desde Shape PARACEL y puntos georreferenciados del monitoreo."),
    mapStoryCard("Ríos graficados", `${formatInt(GIS_MAP.hydrology_count || 0)} segmentos desde geodatos/hidrografia.`),
    mapStoryCard("Puntos visibles", `${visible.length} de ${points.length} dentro del filtro actual.`),
    mapStoryCard("Cauces/sistemas", `${bodies} sistemas representados en el mapa.`),
    mapStoryCard("Alertas territoriales", alertPoints ? `${alertPoints} punto(s) con desvíos a revisar.` : "Sin puntos con alerta en el filtro."),
    mapStoryCard("Comparabilidad", `${Math.round((comparablePoints / Math.max(1, points.length)) * 100)}% de los puntos tiene registros comparables.`),
    `<div class="map-story-card flow-card"><strong>Composición</strong>${flowSummary.map((item) => `<span><i style="background:${escapeAttr(flowColor(item.label))}"></i>${escapeHtml(item.label)} · ${formatInt(item.value)}</span>`).join("")}</div>`,
  ].join("");
}

function featureClass(feature) {
  const classes = ["gis-feature", `gis-${feature.layer}`];
  if (isMainRiver(feature)) classes.push("gis-main-river");
  if (isStreamFeature(feature)) classes.push("gis-stream");
  return classes.map(escapeAttr).join(" ");
}

function isMainRiver(feature) {
  return feature.layer === "hydrology" && /^r[ií]o\s+paraguay/i.test(String(feature.label || ""));
}

function isStreamFeature(feature) {
  return feature.layer === "hydrology" && /arroyo/i.test(String(feature.label || ""));
}

function buildWaterLabels(features, project, bounds) {
  const seen = new Set();
  return features
    .filter((feature) => feature.layer === "hydrology" && feature.label && (isMainRiver(feature) || isStreamFeature(feature)))
    .filter((feature) => {
      const key = normalizeCode(feature.label);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((feature) => {
      const point = featureLabelPoint(feature);
      if (!point) return "";
      const projected = project(point);
      const x = Math.min(bounds.width - 110, Math.max(bounds.margin + 6, projected[0]));
      const y = Math.min(bounds.height - 30, Math.max(bounds.margin + 16, projected[1]));
      return `<text class="gis-water-label" x="${x}" y="${y}">${escapeHtml(feature.label)}</text>`;
    })
    .join("");
}

function featureLabelPoint(feature) {
  if (feature.center) return feature.center;
  if (!feature.lines?.length) return null;
  const line = feature.lines.reduce((best, current) => (current.length > best.length ? current : best), feature.lines[0]);
  return line[Math.floor(line.length / 2)] || line[0] || null;
}

function mapPointAttrs(point) {
  return [
    `data-map-point="${escapeAttr(point.id)}"`,
    `data-point-name="${escapeAttr(point.point)}"`,
    `data-point-body="${escapeAttr(point.water_body)}"`,
    `data-point-type="${escapeAttr(point.point_type || "Sin clasificar")}"`,
    `data-point-records="${escapeAttr(formatInt(point.records))}"`,
    `data-point-alerts="${escapeAttr(formatInt(point.alerts))}"`,
    `data-point-comparable="${escapeAttr(formatInt(point.comparable_records))}"`,
    `data-point-params="${escapeAttr(formatInt(point.parameters?.size || 0))}"`,
    `data-point-years="${escapeAttr(Array.from(point.years || []).sort().join(", ") || "s/d")}"`,
  ].join(" ");
}

function wireMapPointInteractions(root) {
  const card = root.querySelector(".map-hover-card");
  if (!card) return;
  const show = (event, target) => {
    card.innerHTML = mapPointInfoHtml(target.dataset);
    card.hidden = false;
    moveMapHoverCard(root, card, event);
  };
  const hide = () => {
    card.hidden = true;
  };
  root.querySelectorAll(".live-point[data-map-point]").forEach((target) => {
    target.addEventListener("mouseenter", (event) => show(event, target));
    target.addEventListener("mousemove", (event) => moveMapHoverCard(root, card, event));
    target.addEventListener("mouseleave", hide);
    target.addEventListener("focus", (event) => show(event, target));
    target.addEventListener("blur", hide);
    target.addEventListener("click", () => selectPointFromMap(target.dataset.mapPoint));
    target.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPointFromMap(target.dataset.mapPoint);
      }
    });
  });
}

function moveMapHoverCard(root, card, event) {
  const rect = root.getBoundingClientRect();
  const hasPointer = Number.isFinite(event.clientX) && Number.isFinite(event.clientY);
  const rawX = hasPointer ? event.clientX - rect.left + 14 : 20;
  const rawY = hasPointer ? event.clientY - rect.top + 14 : 20;
  const x = Math.min(rect.width - 260, Math.max(10, rawX));
  const y = Math.min(rect.height - 150, Math.max(10, rawY));
  card.style.left = `${x}px`;
  card.style.top = `${y}px`;
}

function mapPointInfoHtml(data) {
  return `<strong>${escapeHtml(data.pointName)}</strong>
    <span>${escapeHtml(data.pointBody)} · ${escapeHtml(data.pointType)}</span>
    <dl>
      <div><dt>Registros</dt><dd>${escapeHtml(data.pointRecords)}</dd></div>
      <div><dt>Comparables</dt><dd>${escapeHtml(data.pointComparable)}</dd></div>
      <div><dt>Alertas</dt><dd>${escapeHtml(data.pointAlerts)}</dd></div>
      <div><dt>Parámetros</dt><dd>${escapeHtml(data.pointParams)}</dd></div>
    </dl>
    <small>Años: ${escapeHtml(data.pointYears)} · Click para filtrar todas las vistas</small>`;
}

function selectPointFromMap(id) {
  const point = pointCatalog.find((row) => pointId(row) === id);
  if (!point) return;
  dom.componentFilter.value = point.component || "";
  dom.mediumFilter.value = point.medium || "";
  dom.waterBodyFilter.value = point.water_body || "";
  clearMulti(dom.pointFilter);
  selectValues(dom.pointFilter, [id]);
  syncChoiceControls();
  renderAll();
}

function featurePath(feature, project) {
  if (feature.lines) {
    return feature.lines
      .map((line) =>
        line
          .map((coord, index) => {
            const [x, y] = project(coord);
            return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" "),
      )
      .join(" ");
  }
  return feature.rings
    .map((ring) =>
      ring
        .map((coord, index) => {
          const [x, y] = project(coord);
          return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ") + " Z",
    )
    .join(" ");
}

function stablePointIndex(point) {
  const id = point.id || pointId(point);
  const index = pointCatalog.findIndex((item) => pointId(item) === id);
  return index >= 0 ? index : Math.abs(hashString(id));
}

function stablePointOrdinal(point, predicate) {
  const id = point.id || pointId(point);
  const group = pointCatalog.filter(predicate);
  const index = group.findIndex((item) => pointId(item) === id);
  return index >= 0 ? index : stablePointIndex(point);
}

function hashString(value) {
  return String(value || "").split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

function realPointPosition(point, index, points) {
  const direct = GIS_MAP.monitoring_points?.[normalizeCode(point.point)];
  if (direct) return direct;
  const suffix = String(point.point || "").split("-").pop()?.toUpperCase();
  const component = GIS_MAP.features?.find((feature) => feature.layer === "components" && String(feature.code || "").toUpperCase() === suffix);
  if (component?.center) {
    const ordinal = stablePointOrdinal(point, (item) => String(item.point || "").toUpperCase().endsWith(`-${suffix}`));
    return { x: component.center[0] + (ordinal % 3 - 1) * 1800, y: component.center[1] + Math.floor(ordinal / 3) * 1800 };
  }
  const bbox = GIS_MAP.bbox;
  const stableIndex = stablePointIndex(point);
  const col = stableIndex % 6;
  const row = Math.floor(stableIndex / 6);
  return { x: bbox[0] + (bbox[2] - bbox[0]) * (0.12 + col * 0.13), y: bbox[3] - (bbox[3] - bbox[1]) * (0.16 + row * 0.11) };
}

function featureLayerLabel(layer) {
  if (layer === "districts") return "Distrito";
  if (layer === "localities_amambay") return "Localidad";
  if (layer === "communities") return "Comunidad";
  if (layer === "components") return "Componente PARACEL";
  if (layer === "hydrology") return "Curso de agua";
  return "Capa GIS";
}

function buildLiveMapPoints(rows) {
  const limit = Number(dom.deviationLimit.value);
  const map = new Map();
  rows.forEach((row) => {
    const id = rowPointId(row);
    if (!map.has(id)) {
      map.set(id, {
        id,
        component: row.component,
        medium: row.medium,
        water_body: row.water_body,
        point: row.point,
        point_type: row.point_type,
        records: 0,
        alerts: 0,
        comparable_records: 0,
        parameters: new Set(),
        years: new Set(),
      });
    }
    const item = map.get(id);
    item.records += 1;
    if (row.comparable) item.comparable_records += 1;
    if (numeric(row.deviation_score) && Math.abs(row.deviation_score) >= limit) item.alerts += 1;
    if (row.parameter_key) item.parameters.add(row.parameter_key);
    if (row.year) item.years.add(row.year);
  });
  const points = [...map.values()].sort((a, b) => `${a.water_body}|${a.point}`.localeCompare(`${b.water_body}|${b.point}`, "es"));
  return points.map((point, index) => ({ ...point, ...livePointPosition(point, index, points) }));
}

function livePointPosition(point, index, points) {
  const legacy = legacyPoints.find((item) => normalizeCode(item.id) === normalizeCode(point.point));
  if (legacy) {
    const lngs = legacyPoints.map((item) => item.lng);
    const lats = legacyPoints.map((item) => item.lat);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    return {
      x: Math.round(80 + ((legacy.lng - minLng) / (maxLng - minLng || 1)) * 640),
      y: Math.round(65 + (1 - (legacy.lat - minLat) / (maxLat - minLat || 1)) * 360),
    };
  }
  if (point.water_body === "Río Paraguay") {
    const order = point.point.includes("FW01") ? 0 : point.point.includes("FW02") ? 1 : point.point.includes("FW03") ? 2 : 1;
    return { x: 905, y: 138 + order * 126 };
  }
  if (point.point_type === "Pozo") {
    const wellIndex = stablePointOrdinal(point, (item) => item.point_type === "Pozo");
    return { x: 755 + (wellIndex % 4) * 68, y: 104 + Math.floor(wellIndex / 4) * 58 };
  }
  const bodies = unique(pointCatalog.map((item) => item.water_body));
  const bodyIndex = Math.max(0, bodies.indexOf(point.water_body));
  const ordinal = stablePointOrdinal(point, (item) => item.water_body === point.water_body);
  const col = bodyIndex % 4;
  const row = Math.floor(bodyIndex / 4);
  return {
    x: 120 + col * 160 + (ordinal % 3) * 34,
    y: 108 + row * 118 + Math.floor(ordinal / 3) * 38,
  };
}

function mapStoryCard(title, text) {
  return `<div class="map-story-card"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></div>`;
}

function normalizeCode(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function flowColor(type) {
  if (type === "Entrada") return "#c1423b";
  if (type === "Medio") return "#d8a928";
  if (type === "Salida") return "#177346";
  if (type === "Pozo") return "#2f6fa3";
  return "#6b7280";
}

function renderChart(rows) {
  drawTrendChart(document.querySelector("#trendChart"), document.querySelector("#chartMode"), rows);
  drawTrendChart(document.querySelector("#seriesTrendChart"), document.querySelector("#seriesChartMode"), rows);
}

function drawTrendChart(svg, modeLabel, rows) {
  if (!svg) return;
  const chartRows = rows.filter((row) => numeric(row.value));
  svg.innerHTML = "";
  const width = 1000;
  const height = 460;
  const margin = { top: 50, right: 28, bottom: 58, left: 70 };
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  if (!chartRows.length) {
    svg.append(textEl(width / 2, height / 2, "No hay valores numéricos para el filtro actual", "chart-title", "middle"));
    if (modeLabel) modeLabel.textContent = "sin datos";
    return;
  }

  const parameterCount = unique(chartRows.map((row) => row.parameter_key)).length;
  const normalize = parameterCount > 1;
  if (modeLabel) modeLabel.textContent = normalize ? "base 100 por serie" : "valores reales";

  const xLabels = buildXLabels(chartRows);
  const grouped = groupForChart(chartRows, xLabels, normalize).slice(0, 10);
  const values = grouped.flatMap((group) => group.points.map((point) => point.y).filter(numeric));
  if (!values.length) return;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min = min - 1;
    max = max + 1;
  }
  const pad = (max - min) * 0.14;
  min -= pad;
  max += pad;

  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const x = (idx) => margin.left + (xLabels.length === 1 ? plotW / 2 : (idx / (xLabels.length - 1)) * plotW);
  const y = (value) => margin.top + (1 - (value - min) / (max - min)) * plotH;

  for (let i = 0; i <= 5; i += 1) {
    const value = min + ((max - min) * i) / 5;
    const yy = y(value);
    svg.append(lineEl(margin.left, yy, width - margin.right, yy, "chart-grid"));
    svg.append(textEl(margin.left - 10, yy + 4, formatNumber(value), "chart-label", "end"));
  }

  svg.append(lineEl(margin.left, height - margin.bottom, width - margin.right, height - margin.bottom, "chart-axis"));
  svg.append(lineEl(margin.left, margin.top, margin.left, height - margin.bottom, "chart-axis"));

  xLabels.forEach((label, idx) => {
    const xx = x(idx);
    svg.append(lineEl(xx, height - margin.bottom, xx, height - margin.bottom + 6, "chart-axis"));
    svg.append(textEl(xx, height - margin.bottom + 24, label, "chart-label", "middle"));
  });

  const firstGroup = grouped[0];
  if (!normalize && firstGroup && firstGroup.rawRows.length > 1) {
    const base = firstGroup.rawRows.find((row) => numeric(row.baseline_value));
    const sdRow = firstGroup.rawRows.find((row) => numeric(row.sd) && row.sd > 0);
    if (base && sdRow) {
      const limit = Number(dom.deviationLimit.value);
      const upper = base.baseline_value + limit * sdRow.sd;
      const lower = base.baseline_value - limit * sdRow.sd;
      const top = y(Math.min(max, upper));
      const bottom = y(Math.max(min, lower));
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", margin.left);
      rect.setAttribute("y", Math.min(top, bottom));
      rect.setAttribute("width", plotW);
      rect.setAttribute("height", Math.abs(bottom - top));
      rect.setAttribute("class", "chart-band");
      svg.prepend(rect);
      svg.append(textEl(width - margin.right, Math.min(top, bottom) - 6, `banda ±${limit} DE`, "chart-label", "end"));
    }
  }

  grouped.forEach((group, index) => {
    const color = colors[index % colors.length];
    const points = group.points.filter((point) => numeric(point.y));
    if (!points.length) return;
    const path = points.map((point, idx) => `${idx === 0 ? "M" : "L"}${x(point.xIndex)},${y(point.y)}`).join(" ");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", path);
    line.setAttribute("class", "chart-line");
    line.setAttribute("stroke", color);
    svg.append(line);
    points.forEach((point) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x(point.xIndex));
      circle.setAttribute("cy", y(point.y));
      circle.setAttribute("r", point.alert ? 6 : 4);
      circle.setAttribute("class", "chart-dot");
      circle.setAttribute("fill", point.alert ? "#b8423f" : color);
      svg.append(circle);
    });
    const legendY = 18 + index * 18;
    svg.append(lineEl(width - 250, legendY - 4, width - 232, legendY - 4, "", color));
    svg.append(textEl(width - 225, legendY, group.label.slice(0, 42), "chart-label", "start"));
  });

  svg.append(textEl(margin.left, 28, normalize ? "Tendencia normalizada: primer valor = 100" : "Valores segun fuente: promedio o mediana disponible", "chart-title"));
}

function renderReading(rows) {
  const uniquePoints = unique(rows.map((row) => rowPointId(row))).length;
  const comparable = rows.filter((row) => row.comparable).length;
  const total = rows.length || 1;
  const selectedParams = unique(rows.map((row) => row.parameter)).slice(0, 3).join(", ");
  const bodies = unique(rows.map((row) => row.water_body)).slice(0, 3).join(", ");
  const readableStatus =
    comparable === 0
      ? "La selección sirve como referencia, pero todavía no sostiene una comparación estadística."
      : `${Math.round((comparable / total) * 100)}% de los registros filtrados cumple el criterio de comparabilidad.`;
  const html = [
    readingCard("Cobertura", `${uniquePoints} puntos y ${unique(rows.map((row) => row.parameter_key)).length} parámetros.`),
    readingCard("Lectura estadística", readableStatus),
    readingCard("Parámetros principales", selectedParams || "Seleccione un parámetro para concentrar la lectura."),
    readingCard("Cauce o sistema", bodies || "Sin cauce seleccionado."),
  ].join("");
  document.querySelector("#readingSummary").innerHTML = html;
}

function renderAlerts(rows) {
  const alerts = flaggedRows(rows).slice(0, 12);
  const list = document.querySelector("#alertList");
  if (!alerts.length) {
    list.innerHTML = `<div class="reading-card"><strong>Sin alertas</strong><span>No hay registros que superen el límite de desviación definido para el filtro actual.</span></div>`;
    return;
  }
  list.innerHTML = alerts
    .map(
      (row) => `<div class="alert-item"><strong>${escapeHtml(row.parameter)} · ${escapeHtml(row.point)}</strong><small>${escapeHtml(row.water_body)} · ${periodLabel(row)} · desviación ${formatNumber(row.deviation_score)} DE</small></div>`,
    )
    .join("");
}

function renderEvolutionTable(rows) {
  const sorted = [...rows]
    .filter((row) => row.value !== null && row.value !== undefined)
    .sort((a, b) => Math.abs(b.delta_pct_vs_baseline || 0) - Math.abs(a.delta_pct_vs_baseline || 0))
    .slice(0, 600);
  renderTable("#evolutionTable", ["Cauce", "Punto", noteHeader("Tipo", "colorHelp"), "Parámetro", "Periodo", noteHeader("n", "nMetric"), noteHeader("Valor", "valueMetric"), noteHeader("Base 2021", "baseline"), noteHeader("Δ 2021", "deltaBase"), noteHeader("Base 2023", "baseline"), noteHeader("Δ 2023", "deltaBase"), noteHeader("Estado", "status")], sorted.map((row) => [
    row.water_body,
    row.point,
    chip(row.point_type),
    row.parameter,
    periodLabel(row),
    formatCount(row.n),
    formatNumber(row.value),
    formatNumber(row.baseline_2021_value),
    formatPercent(row.delta_pct_vs_2021),
    formatNumber(row.baseline_2023_value),
    formatPercent(row.delta_pct_vs_2023),
    row.comparable ? "Comparable" : "Referencial",
  ]));
}

function renderEvolutionDetailTable(rows) {
  const sorted = [...rows]
    .filter((row) => row.value !== null && row.value !== undefined)
    .sort((a, b) => Math.abs(b.delta_pct_vs_baseline || 0) - Math.abs(a.delta_pct_vs_baseline || 0))
    .slice(0, 700);
  renderTable("#evolutionDetailTable", ["Componente", "Medio", "Cauce", "Punto", noteHeader("Tipo", "colorHelp"), "Parametro", "Periodo", noteHeader("n", "nMetric"), noteHeader("Valor", "valueMetric"), noteHeader("DE", "sdMetric"), noteHeader("Base 2021", "baseline"), noteHeader("Delta 2021", "deltaBase"), noteHeader("Base 2023", "baseline"), noteHeader("Delta 2023", "deltaBase"), noteHeader("Representatividad", "representativeness"), noteHeader("Estado", "status")], sorted.map((row) => [
    row.component,
    row.medium,
    row.water_body,
    row.point,
    chip(row.point_type),
    row.parameter,
    periodLabel(row),
    formatCount(row.n),
    formatNumber(row.value),
    formatNumber(row.sd),
    formatNumber(row.baseline_2021_value),
    formatPercent(row.delta_pct_vs_2021),
    formatNumber(row.baseline_2023_value),
    formatPercent(row.delta_pct_vs_2023),
    row.representativeness_note || "",
    row.comparable ? "Comparable" : "Referencial",
  ]));
}

function renderCompatibilityTable() {
  const rows = buildPointCatalog(filteredSeries()).slice(0, 500);
  renderTable("#pointCompatibilityTable", ["Cauce", "Punto", noteHeader("Tipo", "colorHelp"), "Años", "Parámetros", noteHeader("Registros comparables", "comparable"), noteHeader("Determinación", "status")], rows.map((row) => [
    row.water_body,
    row.point,
    chip(row.point_type),
    row.years?.length ? row.years.join(", ") : "Consolidado",
    formatInt(row.parameters_count),
    formatInt(row.comparable_records),
    row.comparable ? "Usable para comparación" : "Solo referencial",
  ]));
}

function renderCompatibilityDetailTable() {
  const rows = buildPointCatalog(filteredSeries()).slice(0, 700);
  renderTable("#pointCompatibilityDetailTable", ["Componente", "Medio", "Cauce", "Punto", noteHeader("Tipo", "colorHelp"), noteHeader("Color", "colorHelp"), "Anios", "Parametros", noteHeader("Registros comparables", "comparable"), noteHeader("Determinacion", "status")], rows.map((row) => [
    row.component,
    row.medium,
    row.water_body,
    row.point,
    chip(row.point_type),
    colorLabel(row),
    row.years?.length ? row.years.join(", ") : "Consolidado",
    formatInt(row.parameters_count),
    formatInt(row.comparable_records),
    row.comparable ? "Usable para comparacion" : "Solo referencial",
  ]));
}

function renderStatTests() {
  const rows = filteredTests();
  const significant = rows.filter((row) => row.significant).length;
  document.querySelector("#statSummary").innerHTML = `
    <div><strong>${formatInt(rows.length)}</strong><span>pruebas filtradas</span></div>
    <div><strong>${formatInt(significant)}</strong><span>p&lt;0,05</span></div>
    <div><strong>${formatInt(unique(rows.map((row) => row.parameter_key)).length)}</strong><span>parámetros con prueba</span></div>
  `;
  renderTable("#statTestsTable", ["Componente", "Cauce", "Parámetro", "Grupo", noteHeader("Test", "testType"), noteHeader("H", "hStat"), noteHeader("p-valor", "pValue"), noteHeader("Representatividad", "representativeness"), noteHeader("Resultado", "status")], rows.slice(0, 500).map((row) => [
    row.component,
    row.water_body,
    row.parameter,
    row.group || row.grouping,
    row.test,
    formatNumber(row.h),
    formatP(row.p_value),
    representativenessText(row.n),
    row.significant ? "Diferencia significativa" : "Sin diferencia significativa",
  ]));
}

function renderDataTable(rows) {
  const visible = rows.slice(0, 700);
  renderTable("#dataTable", ["Cauce", "Punto", noteHeader("Tipo", "colorHelp"), "Parámetro", "Periodo", noteHeader("n", "nMetric"), noteHeader("Valor", "valueMetric"), noteHeader("Fuente", "sourceHelp")], visible.map((row) => [
    row.water_body,
    row.point,
    chip(row.point_type),
    row.parameter,
    periodLabel(row),
    formatCount(row.n),
    formatNumber(row.value),
    sourceLabel(row.source),
  ]));
}

function renderDataDetailTable(rows) {
  const visible = rows.slice(0, 900);
  renderTable("#dataDetailTable", ["Componente", "Medio", "Cauce", "Punto", noteHeader("Tipo", "colorHelp"), "Parametro", "Periodo", noteHeader("n", "nMetric"), noteHeader("Valor", "valueMetric"), noteHeader("DE", "sdMetric"), noteHeader("Representatividad", "representativeness"), noteHeader("Fuente", "sourceHelp")], visible.map((row) => [
    row.component,
    row.medium,
    row.water_body,
    row.point,
    chip(row.point_type),
    row.parameter,
    periodLabel(row),
    formatCount(row.n),
    formatNumber(row.value),
    formatNumber(row.sd),
    row.representativeness_note || "",
    sourceLabel(row.source),
  ]));
}

function renderRioParaguay(rows) {
  const rioRows = rows.filter((row) => row.water_body === "Río Paraguay");
  const sources = DATA.rio_paraguay_sources || [];
  document.querySelector("#rioSourceCards").innerHTML = sources
    .map((source) => `<article class="source-card"><strong>${escapeHtml(source.role)}</strong><span>${escapeHtml(source.file)} · ${escapeHtml(source.sheet)}</span></article>`)
    .join("");
  document.querySelector("#rioKpis").innerHTML = `
    <div><strong>${formatInt(rioRows.length)}</strong><span>series filtradas</span></div>
    <div><strong>${formatInt(unique(rioRows.map((row) => row.parameter_key)).length)}</strong><span>parámetros</span></div>
    <div><strong>${formatInt(unique(rioRows.map((row) => row.point)).length)}</strong><span>puntos del Río Paraguay</span></div>
  `;
  renderTable("#rioTable", ["Punto", noteHeader("Tipo", "colorHelp"), "Parámetro", "Periodo", noteHeader("n", "nMetric"), noteHeader("Valor", "valueMetric"), noteHeader("Estado", "status")], rioRows.slice(0, 700).map((row) => [
    row.point,
    chip(row.point_type),
    row.parameter,
    periodLabel(row),
    formatCount(row.n),
    formatNumber(row.value),
    row.comparable ? "Comparable" : "Referencial",
  ]));
}

function renderRioDetailTable(rows) {
  const rioRows = rows.filter((row) => row.water_body === "Río Paraguay");
  renderTable("#rioDetailTable", ["Punto", noteHeader("Tipo", "colorHelp"), noteHeader("Color pestana", "colorHelp"), "Parametro", "Periodo", noteHeader("n", "nMetric"), noteHeader("Valor", "valueMetric"), noteHeader("DE", "sdMetric"), noteHeader("Enfoques", "approachHelp"), noteHeader("Representatividad", "representativeness"), noteHeader("Fuente", "sourceHelp")], rioRows.slice(0, 900).map((row) => [
    row.point,
    chip(row.point_type),
    colorLabel(row),
    row.parameter,
    periodLabel(row),
    formatCount(row.n),
    formatNumber(row.value),
    formatNumber(row.sd),
    (row.approaches || []).map(escapeHtml).join("<br>"),
    row.representativeness_note || "",
    sourceLabel(row.source),
  ]));
}

function loadLegacyData() {
  fetch("../data.json", { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : []))
    .then((payload) => {
      legacyRecords = Array.isArray(payload) ? payload : [];
      legacyLoaded = true;
      renderLegacyDashboard();
    })
    .catch(() => {
      legacyRecords = [];
      legacyLoaded = true;
      renderLegacyDashboard();
    });
}

function renderLegacyDashboard() {
  if (!document.querySelector("#legacyTotal")) return;
  const stats = buildLegacyStats();
  setText("#legacyTotal", legacyLoaded ? formatInt(stats.totalRecords) : "...");
  setText("#legacyPoints", formatInt(stats.totalPoints));
  setText("#legacyPct", numeric(stats.globalPct) ? `${formatFixed(stats.globalPct, 1)}%` : "s/d");
  setText("#legacyCampaigns", formatInt(legacyHistorical.length));
  renderLegacyTimeline(stats.historical);
  renderLegacyBars("#legacySubFigure", stats.bySub.slice(0, 10), "sub", "pct", "%", true);
  renderLegacyBars("#legacyParamFigure", stats.paramIncumpl.slice(0, 10), "param", "n", "inc.");
  renderLegacyBars("#legacyPointFigure", stats.byPunto.filter((row) => numeric(row.lastPct)).slice(0, 18), "punto", "lastPct", "%", true);
  renderLegacyMap(stats.byPunto);
  renderLegacyHistoricalTable(stats.historical);
  renderLegacyLastRecords(stats.latest);
  syncChoiceControls();
}

function buildLegacyStats() {
  const weighted = legacyRecords.reduce(
    (acc, row) => {
      const dl = legacyNumber(row.DL);
      const fl = legacyNumber(row.FL);
      if (numeric(dl) && numeric(fl) && dl + fl > 0) {
        acc.dl += dl;
        acc.total += dl + fl;
      }
      return acc;
    },
    { dl: 0, total: 0 },
  );
  const historicalWeighted = legacyHistorical.reduce(
    (acc, row) => ({ dl: acc.dl + row.dl, total: acc.total + row.total }),
    { dl: 0, total: 0 },
  );
  const globalPct = weighted.total ? (weighted.dl / weighted.total) * 100 : (historicalWeighted.dl / historicalWeighted.total) * 100;

  const bySub = new Map();
  legacyRecords.forEach((row) => {
    const sub = legacyValue(row, "Subcuenca") || "N/D";
    const dl = legacyNumber(row.DL);
    const fl = legacyNumber(row.FL);
    if (!numeric(dl) || !numeric(fl) || dl + fl <= 0) return;
    const item = bySub.get(sub) || { sub, dl: 0, fl: 0 };
    item.dl += dl;
    item.fl += fl;
    bySub.set(sub, item);
  });

  const byPunto = new Map();
  legacyPoints.forEach((point) => byPunto.set(point.id, { punto: point.id, sub: point.sub, lat: point.lat, lng: point.lng, count: 0, lastPct: null, lastYear: null }));
  legacyRecords.forEach((row) => {
    const punto = legacyValue(row, "Punto_ID");
    if (!punto) return;
    const current = byPunto.get(punto) || { punto, sub: legacyValue(row, "Subcuenca") || "N/D", count: 0, lastPct: null, lastYear: null };
    const year = legacyYear(row);
    const pct = legacyNumber(row.Pct_Cumplimiento);
    current.count += 1;
    if (numeric(pct) && (!numeric(current.lastYear) || year >= current.lastYear)) {
      current.lastPct = pct;
      current.lastYear = year;
      current.sub = legacyValue(row, "Subcuenca") || current.sub;
    }
    byPunto.set(punto, current);
  });

  const paramIncumpl = new Map();
  legacyRecords.forEach((row) => {
    Object.entries(legacyParamLimits).forEach(([param, limit]) => {
      const value = legacyNumber(row[param]);
      if (!numeric(value)) return;
      const [min, max] = limit;
      const out = (min !== null && value < min) || (max !== null && value > max);
      if (out) paramIncumpl.set(param, (paramIncumpl.get(param) || 0) + 1);
    });
  });

  const latest = [...legacyRecords]
    .filter((row) => legacyValue(row, "ID_Muestra"))
    .sort((a, b) => legacySortKey(b) - legacySortKey(a))
    .slice(0, 16);

  return {
    totalRecords: legacyRecords.length,
    totalPoints: unique([...legacyPoints.map((point) => point.id), ...legacyRecords.map((row) => legacyValue(row, "Punto_ID"))]).length,
    globalPct,
    historical: legacyHistorical,
    bySub: [...bySub.values()]
      .map((row) => ({ ...row, pct: row.dl + row.fl > 0 ? (row.dl / (row.dl + row.fl)) * 100 : null }))
      .sort((a, b) => (b.pct || 0) - (a.pct || 0)),
    byPunto: [...byPunto.values()].sort((a, b) => (b.lastPct || -1) - (a.lastPct || -1)),
    paramIncumpl: [...paramIncumpl.entries()]
      .map(([param, n]) => ({ param: legacyParamLabel(param), n }))
      .sort((a, b) => b.n - a.n),
    latest,
  };
}

function renderLegacyTimeline(rows) {
  const root = document.querySelector("#legacyCumplFigure");
  if (!root) return;
  root.innerHTML = `<div class="legacy-campaign-grid">${rows
    .map((row) => {
      const width = Math.max(4, Math.round(row.pct));
      return `<div class="legacy-campaign ${legacyPctClass(row.pct)}"><span>${row.anio} ${escapeHtml(row.temp)}</span><div class="bar-track"><i style="width:${width}%"></i></div><strong>${formatNumber(row.pct)}%</strong><small>${formatInt(row.dl)} DL / ${formatInt(row.fl)} FL</small></div>`;
    })
    .join("")}</div>`;
}

function renderLegacyBars(selector, rows, labelKey, valueKey, suffix, percentScale = false) {
  const root = document.querySelector(selector);
  if (!root) return;
  if (!rows.length) {
    root.innerHTML = `<div class="empty-figure">Sin datos de la primera version para esta figura.</div>`;
    return;
  }
  const max = percentScale ? 100 : Math.max(...rows.map((row) => Number(row[valueKey]) || 0), 1);
  root.innerHTML = rows
    .map((row) => {
      const value = Number(row[valueKey]) || 0;
      const width = Math.max(3, Math.min(100, Math.round((value / max) * 100)));
      const shownValue = percentScale ? `${formatFixed(value, 1)}%` : formatNumber(value);
      return `<div class="bar-row legacy-bar"><span>${escapeHtml(row[labelKey])}</span><div class="bar-track ${legacyPctClass(value)}"><i style="width:${width}%"></i></div><strong>${shownValue}</strong><small>${percentScale ? "" : escapeHtml(suffix)}</small></div>`;
    })
    .join("");
}

function renderLegacyMap(pointRows) {
  const root = document.querySelector("#legacyMap");
  if (!root) return;
  const filter = document.querySelector("#legacyMapFilter")?.value || "all";
  const points = legacyPoints
    .map((point) => ({ ...point, ...(pointRows.find((row) => row.punto === point.id) || {}) }))
    .filter((point) => filter === "all" || point.sub === filter);
  if (!points.length) {
    root.innerHTML = `<div class="empty-figure">Sin puntos para el filtro seleccionado.</div>`;
    return;
  }
  const width = 980;
  const height = 440;
  const lngs = legacyPoints.map((point) => point.lng);
  const lats = legacyPoints.map((point) => point.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const x = (lng) => 55 + ((lng - minLng) / (maxLng - minLng || 1)) * (width - 110);
  const y = (lat) => 40 + (1 - (lat - minLat) / (maxLat - minLat || 1)) * (height - 80);
  root.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Mapa legado de puntos de monitoreo">
    <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="12" class="legacy-map-bg"></rect>
    ${points
      .map((point) => {
        const color = complianceColor(point.lastPct);
        const label = `${point.id} | ${point.sub} | ${numeric(point.lastPct) ? `${formatNumber(point.lastPct)}%` : "sin datos"}`;
        return `<g class="legacy-map-point"><circle cx="${x(point.lng)}" cy="${y(point.lat)}" r="9" fill="${color}"><title>${escapeHtml(label)}</title></circle><text x="${x(point.lng) + 12}" y="${y(point.lat) + 4}">${escapeHtml(point.id.replace("FW ", ""))}</text></g>`;
      })
      .join("")}
  </svg>`;
}

function renderLegacyHistoricalTable(rows) {
  renderTable("#legacyHistoricoTable", ["Año", "Temporada", "Puntos", "DL", "FL", "Total", "% Cumplimiento"], rows.map((row) => [
    row.anio,
    row.temp === "RS" ? "Lluviosa (RS)" : "Seca (DS)",
    formatInt(row.nPuntos),
    formatInt(row.dl),
    formatInt(row.fl),
    formatInt(row.total),
    `${formatNumber(row.pct)}%`,
  ]));
}

function renderLegacyLastRecords(rows) {
  renderTable("#legacyLastRecords", ["ID muestra", "Punto", "Subcuenca", "Año", "Temporada", "pH", "OD", "Turbidez", "DL", "FL", "% Cumpl."], rows.map((row) => [
    legacyValue(row, "ID_Muestra"),
    legacyValue(row, "Punto_ID"),
    legacyValue(row, "Subcuenca"),
    legacyYear(row) || "",
    legacySeason(row),
    legacyValue(row, "pH"),
    legacyValue(row, "OD"),
    legacyValue(row, "Turbidez"),
    legacyValue(row, "DL"),
    legacyValue(row, "FL"),
    numeric(legacyNumber(row.Pct_Cumplimiento)) ? `${formatNumber(legacyNumber(row.Pct_Cumplimiento))}%` : "",
  ]));
}

function legacyValue(row, key) {
  if (!row) return "";
  if (row[key] !== undefined && row[key] !== null) return row[key];
  if (key === "Año") return row["AÃ±o"] ?? row["Anio"] ?? "";
  return "";
}

function legacyYear(row) {
  return Number(legacyValue(row, "Año")) || 0;
}

function legacySeason(row) {
  return row.Cod_Temporada || row.Temporada || "";
}

function legacySortKey(row) {
  const seasonRank = legacySeason(row) === "DS" || legacySeason(row) === "Seca" ? 2 : 1;
  return legacyYear(row) * 10 + seasonRank;
}

function legacyNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value ?? "").trim();
  if (!text || /^(s\/?d|n\/?a|nd|no detectable|presencia|ausencia)$/i.test(text)) return null;
  const cleaned = text.replace(",", ".").replace(/[<>]/g, "").replace(/[^\d.-]/g, "");
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function legacyParamLabel(param) {
  return String(param).replaceAll("_", " ");
}

function legacyPctClass(value) {
  if (!numeric(value)) return "none";
  if (value >= 85) return "ok";
  if (value >= 70) return "warn";
  return "bad";
}

function complianceColor(value) {
  if (!numeric(value)) return "#6b7280";
  if (value >= 85) return "#177346";
  if (value >= 70) return "#d8a928";
  return "#c1423b";
}

function renderGuide() {
  const guide = [
    ...(DATA.methodology || []).map((item) => ({ title: item.title, text: item.text })),
    {
      title: "Valor, promedio y mediana",
      text: "La app usa el valor disponible mas representativo: promedio cuando la fuente lo entrega, mediana cuando corresponde o promedio calculado desde campañas individuales.",
    },
    {
      title: "n",
      text: "n es la cantidad de observaciones que soporta un resultado. En muestras pequeñas conviene leer los resultados como señal y revisar la prueba estadística antes de concluir.",
    },
    {
      title: "Línea de base",
      text: "La línea de base prioritaria es 2021. Para Río Paraguay se conserva el bloque histórico 2019-2023 porque el informe lo trata como línea de base previa a operaciones.",
    },
    {
      title: "Entrada, medio y salida",
      text: "La segmentación permite mirar si un parámetro cambia entre ingreso, tramo medio y salida del cauce. En Río Paraguay: FW01-PY entrada, FW02-PY medio, FW03-PY salida.",
    },
    {
      title: "Pruebas no paramétricas",
      text: "Kruskal-Wallis se usa cuando la normalidad no es compatible o cuando el diseño exige una comparación robusta entre grupos. Es adecuada para muestras pequeñas, aunque requiere n suficiente.",
    },
    {
      title: "Caracteres especiales",
      text: "La app trabaja en UTF-8 y conserva tildes, ñ y símbolos de unidades. También normaliza variantes internas para evitar duplicar un mismo parámetro por diferencias de escritura.",
    },
    {
      title: "Revisión de consultora",
      text: "La pestaña de compatibilidad expone pruebas extraídas de anexos de Shapiro, ANOVA, Kruskal-Wallis y Tukey disponibles localmente para facilitar contraste con el informe.",
    },
    {
      title: "Enfoques laterales",
      text: "Enfoque 1 filtra lecturas por campaña, Enfoque 2 concentra comparaciones temporales y Enfoque 3 mira evolución del programa. Pueden combinarse para acotar todas las vistas.",
    },
    {
      title: "Colores de pestañas",
      text: "La regla operativa es rojo=entrada, verde=salida y amarillo=intermedio. Si el color no está preservado en el anexo local, la app muestra la clasificación equivalente y su fuente.",
    },
    {
      title: "29 parámetros iniciales y 35 actuales",
      text: "El programa comenzó con un conjunto inicial cercano a 29 parámetros y hoy ronda 35. La app muestra más etiquetas porque integra anexos, medios, abreviaturas y pruebas estadísticas normalizadas.",
    },
    {
      title: "Cómo leer una métrica",
      text: "Revise parámetro, punto, periodo, n, valor, DE, base 2021/2023 y fuente. Una métrica aislada describe; una métrica comparable permite sostener lectura de cambio.",
    },
    {
      title: "Promedio",
      text: "Resume el centro aritmético de los datos. Puede verse afectado por valores extremos, por eso se revisa junto con mediana y desviación estándar.",
    },
    {
      title: "Mediana",
      text: "Valor central robusto: la mitad de observaciones queda por encima y la mitad por debajo. Ayuda cuando hay asimetrías o valores atípicos.",
    },
    {
      title: "Desviación estándar",
      text: "Mide dispersión. Si es alta, la serie es variable y la interpretación requiere más cautela antes de marcar una variación como relevante.",
    },
    {
      title: "Dato referencial",
      text: "Dato útil para observación, pero insuficiente para inferencia. Puede deberse a n bajo, falta de repetición, cambio de punto o cobertura incompleta.",
    },
    {
      title: "Dato comparable",
      text: "Dato con soporte mínimo para contrastar años o puntos. La app usa una regla conservadora: n>=2 en al menos dos años o comparación consolidada suficiente.",
    },
    {
      title: "Por campaña",
      text: "Permite revisar mediciones o agregados por campaña. Es útil para detectar estacionalidad, eventos puntuales y posibles errores de carga.",
    },
    {
      title: "En el tiempo",
      text: "Ordena la lectura por años o periodos. Sirve para observar tendencias, cambios respecto de base y continuidad del monitoreo.",
    },
    {
      title: "Evolución del programa",
      text: "Integra series comparables y consolidadas para evaluar si el programa gana cobertura, consistencia y capacidad de explicación.",
    },
    {
      title: "Entrada, medio y salida",
      text: "Ayuda a leer gradientes a lo largo del cauce. Si una salida cambia respecto de una entrada, corresponde revisar caudal, lluvia, campañas y actividades cercanas.",
    },
    {
      title: "Muestras pequeñas",
      text: "Con n bajo conviene priorizar pruebas no paramétricas, exactas o por permutación. La app marca representatividad para no convertir señales débiles en conclusiones fuertes.",
    },
    {
      title: "Revisión de cálculos de consultora",
      text: "La app expone test, p-valor, H, grupo, fuente y fila del anexo para contrastar los resultados estadísticos contra los libros entregados por la consultora.",
    },
    {
      title: "Problemas de caracteres especiales",
      text: "Los archivos de la app están en UTF-8 y se validan para evitar caracteres corruptos. Los nombres se normalizan sin perder la etiqueta legible con acentos.",
    },
  ];
  document.querySelector("#guideGrid").innerHTML = guide
    .map((item) => `<article class="guide-card"><strong>(i) ${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></article>`)
    .join("");
}

function initCaptureModule() {
  renderCapturePointOptions();
  renderCaptureParameterInputs();
  syncCapturePointMeta();
  renderAuthState();
  renderCaptureAuditTable();
}

function renderCaptureView() {
  renderAuthState();
  renderCaptureAuditTable();
}

function renderCapturePointOptions() {
  const select = document.querySelector("#capturePoint");
  if (!select) return;
  const points = buildPointCatalog(series);
  select.innerHTML = points
    .map((point) => `<option value="${escapeAttr(pointId(point))}">${escapeHtml(point.point)} | ${escapeHtml(point.water_body)} | ${escapeHtml(point.point_type || "Sin clasificar")}</option>`)
    .join("");
}

function renderCaptureParameterInputs() {
  const root = document.querySelector("#parameterEntryGrid");
  if (!root) return;
  root.innerHTML = captureParameters
    .map((item) => `<label><span>${escapeHtml(item.label)}</span><input name="param_${escapeAttr(item.key)}" placeholder="valor" /></label>`)
    .join("");
}

function syncCapturePointMeta() {
  const point = capturePointMeta();
  const subcuenca = document.querySelector("#captureSubcuenca");
  if (subcuenca) subcuenca.value = point?.water_body || "";
}

function capturePointMeta() {
  const select = document.querySelector("#capturePoint");
  const id = select?.value || "";
  return buildPointCatalog(series).find((point) => pointId(point) === id) || null;
}

function renderAuthState() {
  const status = document.querySelector("#authStatus");
  const fieldset = document.querySelector("#captureFieldset");
  const responsible = document.querySelector("#captureResponsible");
  const valid = isSessionUsable();
  if (fieldset) fieldset.disabled = !valid;
  if (responsible && valid && !responsible.value) responsible.value = authState.fullName || authState.username;
  if (!status) return;
  if (valid) {
    status.innerHTML = `<strong>${escapeHtml(authState.fullName || authState.username)}</strong><span>${escapeHtml(authState.role || "responsable")} | sesion activa hasta ${escapeHtml(formatDateTime(authState.expiresAt))}</span><button type="button" id="logoutButton" class="ghost">Salir</button>`;
    document.querySelector("#logoutButton")?.addEventListener("click", logout);
  } else {
    status.innerHTML = `<strong>Sin sesion activa</strong><span>Ingrese o cree un usuario para habilitar el formulario de carga.</span>`;
  }
}

function setAuthMode(mode) {
  document.querySelectorAll("[data-auth-mode]").forEach((button) => button.classList.toggle("is-active", button.dataset.authMode === mode));
  document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.authPanel !== mode;
  });
  setMessage("#authMessage", "");
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const username = normalizeUsername(form.username.value);
  setMessage("#authMessage", "Validando acceso...");
  try {
    const passwordDigest = await credentialDigest(username, form.password.value);
    const result = await apiJsonp("authLogin", { username, passwordDigest });
    if (!result.success) throw new Error(result.error || "No se pudo iniciar sesion");
    saveAuthState(result.session);
    form.reset();
    setMessage("#authMessage", "Acceso confirmado. Ya puede cargar datos.", "success");
    renderAuthState();
    refreshAuditTable();
  } catch (err) {
    setMessage("#authMessage", err.message || String(err), "error");
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const username = normalizeUsername(form.username.value);
  setMessage("#authMessage", "Creando usuario...");
  try {
    const passwordDigest = await credentialDigest(username, form.password.value);
    const result = await apiJsonp("authRegister", {
      username,
      passwordDigest,
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
    });
    if (!result.success) throw new Error(result.error || "No se pudo crear el usuario");
    saveAuthState(result.session);
    form.reset();
    setAuthMode("login");
    setMessage("#authMessage", "Usuario creado y sesion iniciada.", "success");
    renderAuthState();
    refreshAuditTable();
  } catch (err) {
    setMessage("#authMessage", err.message || String(err), "error");
  }
}

async function requestResetCode() {
  const form = document.querySelector("#recoverForm");
  const account = form?.account.value.trim();
  if (!account) {
    setMessage("#authMessage", "Indique usuario o correo.", "error");
    return;
  }
  setMessage("#authMessage", "Solicitando codigo de recuperacion...");
  try {
    const result = await apiJsonp("authRequestReset", { account });
    if (!result.success) throw new Error(result.error || "No se pudo generar el codigo");
    setMessage("#authMessage", result.message || "Codigo enviado al correo registrado.", "success");
  } catch (err) {
    setMessage("#authMessage", err.message || String(err), "error");
  }
}

async function handlePasswordReset(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const account = form.account.value.trim();
  const code = form.code.value.trim();
  const password = form.password.value;
  if (!account || !code || !password) {
    setMessage("#authMessage", "Complete usuario/correo, codigo y nueva contrasena.", "error");
    return;
  }
  setMessage("#authMessage", "Actualizando contrasena...");
  try {
    const usernameHint = normalizeUsername(account.includes("@") ? account.split("@")[0] : account);
    const passwordDigest = await credentialDigest(usernameHint, password);
    const result = await apiJsonp("authResetPassword", { account, code, passwordDigest });
    if (!result.success) throw new Error(result.error || "No se pudo cambiar la contrasena");
    form.reset();
    setAuthMode("login");
    setMessage("#authMessage", "Contrasena actualizada. Ingrese con el nuevo acceso.", "success");
  } catch (err) {
    setMessage("#authMessage", err.message || String(err), "error");
  }
}

async function handleCaptureSubmit(event) {
  event.preventDefault();
  if (!isSessionUsable()) {
    setMessage("#captureMessage", "Debe iniciar sesion antes de cargar.", "error");
    renderAuthState();
    return;
  }
  const form = event.currentTarget;
  const record = buildCaptureRecord(form);
  if (!record.Punto_ID || !record.Anio || !record.Temporada) {
    setMessage("#captureMessage", "Punto, ano y temporada son obligatorios.", "error");
    return;
  }
  setMessage("#captureMessage", "Enviando al libro en linea...");
  try {
    await apiPostNoCors("saveMeasurement", {
      sessionToken: authState.token,
      record,
      client: {
        app: "GitHub Pages",
        userAgent: navigator.userAgent,
        url: location.href,
      },
    });
    addPendingCapture(record);
    form.reset();
    renderCaptureParameterInputs();
    syncCapturePointMeta();
    renderAuthState();
    renderCaptureAuditTable();
    setMessage("#captureMessage", "Carga enviada. La auditoria se actualizara al confirmar el backend.", "success");
    setTimeout(refreshAuditTable, 2500);
  } catch (err) {
    setMessage("#captureMessage", err.message || String(err), "error");
  }
}

function buildCaptureRecord(form) {
  const data = new FormData(form);
  const point = capturePointMeta();
  const dl = valueOrBlank(data.get("dl"));
  const fl = valueOrBlank(data.get("fl"));
  const total = numericInput(dl) + numericInput(fl);
  const pct = total > 0 ? Math.round((numericInput(dl) / total) * 1000) / 10 : "";
  const season = data.get("season") || "";
  const cod = season === "Seca" ? "DS" : "RS";
  const record = {
    Punto_ID: point?.point || "",
    Subcuenca: data.get("subcuenca") || point?.water_body || "",
    Estado_Punto: point?.point_type || "",
    Anio: Number(data.get("year")),
    Temporada: season,
    Cod_Temporada: cod,
    Fecha_Muestreo: data.get("date") || "",
    Responsable: data.get("responsible") || authState.fullName || authState.username || "",
    DL: dl,
    FL: fl,
    Total_Evaluados: total || "",
    Pct_Cumplimiento: pct,
    Observaciones: data.get("observations") || "",
  };
  captureParameters.forEach((param) => {
    const value = valueOrBlank(data.get(`param_${param.key}`));
    if (value !== "") record[param.key] = value;
  });
  return record;
}

function clearCaptureParameterValues() {
  document.querySelectorAll("#parameterEntryGrid input").forEach((input) => {
    input.value = "";
  });
}

async function refreshAuditTable() {
  if (!isSessionUsable()) {
    renderCaptureAuditTable();
    return;
  }
  try {
    const result = await apiJsonp("recentAudit", { sessionToken: authState.token });
    if (result.success && Array.isArray(result.data)) {
      localStorage.setItem(pendingCaptureKey, JSON.stringify(result.data.map((row) => ({ ...row, confirmed: true }))));
    }
  } catch {
    // Keep local pending queue when the backend is not reachable.
  }
  renderCaptureAuditTable();
}

function renderCaptureAuditTable() {
  const table = document.querySelector("#captureAuditTable");
  if (!table) return;
  const rows = loadPendingCaptures();
  renderTable("#captureAuditTable", ["Estado", "Fecha", "Usuario", "Accion", "Punto", "Periodo", "Resumen"], rows.slice(0, 12).map((row) => [
    row.confirmed ? "Confirmado" : "Enviado",
    escapeHtml(formatDateTime(row.timestamp || row.Timestamp || row.fecha)),
    escapeHtml(row.username || row.Usuario || authState?.username || ""),
    escapeHtml(row.action || row.Accion || "saveMeasurement"),
    escapeHtml(row.point || row.Punto_ID || row.record?.Punto_ID || ""),
    escapeHtml(row.period || row.Periodo || `${row.record?.Anio || ""} ${row.record?.Cod_Temporada || ""}`.trim()),
    escapeHtml(row.summary || row.Resumen || row.record?.Observaciones || ""),
  ]));
}

function addPendingCapture(record) {
  const rows = loadPendingCaptures();
  rows.unshift({
    timestamp: new Date().toISOString(),
    username: authState.username,
    action: "saveMeasurement",
    point: record.Punto_ID,
    period: `${record.Anio} ${record.Cod_Temporada}`,
    summary: record.Observaciones || "Nueva medicion enviada",
    record,
    confirmed: false,
  });
  localStorage.setItem(pendingCaptureKey, JSON.stringify(rows.slice(0, 30)));
}

function loadPendingCaptures() {
  try {
    return JSON.parse(localStorage.getItem(pendingCaptureKey)) || [];
  } catch {
    return [];
  }
}

function saveAuthState(session) {
  authState = session || null;
  localStorage.setItem(authStorageKey, JSON.stringify(authState));
}

function loadAuthState() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey));
  } catch {
    return null;
  }
}

function logout() {
  authState = null;
  localStorage.removeItem(authStorageKey);
  renderAuthState();
  renderCaptureAuditTable();
}

function isSessionUsable() {
  return Boolean(authState?.token && (!authState.expiresAt || new Date(authState.expiresAt).getTime() > Date.now()));
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

async function credentialDigest(username, password) {
  return sha256Hex(password || "");
}

async function sha256Hex(text) {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function apiJsonp(action, payload = {}) {
  return new Promise((resolve, reject) => {
    const callback = `paracelWaterCb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const url = new URL(apiUrl);
    url.searchParams.set("action", action);
    url.searchParams.set("callback", callback);
    url.searchParams.set("payload", JSON.stringify(payload));
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("El backend no respondio a tiempo."));
    }, 18000);
    function cleanup() {
      clearTimeout(timeout);
      delete window[callback];
      script.remove();
    }
    window[callback] = (data) => {
      cleanup();
      resolve(data || {});
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("No se pudo contactar el backend."));
    };
    script.src = url.toString();
    document.head.append(script);
  });
}

function apiPostNoCors(action, payload = {}) {
  return fetch(apiUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });
}

function setMessage(selector, text, type = "") {
  const node = document.querySelector(selector);
  if (!node) return;
  node.textContent = text || "";
  node.dataset.type = type;
}

function valueOrBlank(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function numericInput(value) {
  const parsed = Number(String(value || "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function renderEditTable() {
  renderTable("#editTable", ["Componente", "Medio", "Cauce", "Punto", "Clasificación", "Años", "Parámetros"], buildPointCatalog(filteredSeries()).map((row) => {
    const id = pointId(row);
    const buttons = pointTypes
      .map((type) => `<button type="button" class="edit-type ${row.point_type === type ? "is-active" : ""}" data-edit-point="${escapeAttr(id)}" data-edit-value="${escapeAttr(type)}">${escapeHtml(type)}</button>`)
      .join("");
    return [row.component, row.medium, row.water_body, row.point, `<div class="edit-type-group">${buttons}</div>`, row.years?.join(", ") || "Consolidado", formatInt(row.parameters_count)];
  }));
  document.querySelectorAll("[data-edit-point][data-edit-value]").forEach((button) => {
    button.addEventListener("click", () => {
      overrides.points[button.dataset.editPoint] = { point_type: button.dataset.editValue };
      saveOverrides();
      location.reload();
    });
  });
}

function selectApproach(value) {
  clearMulti(dom.approachFilter);
  selectValues(dom.approachFilter, [value]);
  renderAll();
}

function clearFilters() {
  Object.values(dom).forEach((element) => {
    if (!element) return;
    if (element.tagName === "SELECT") {
      [...element.options].forEach((option) => {
        option.selected = false;
      });
      if (!element.multiple) element.value = "";
    }
    if (element.type === "checkbox") element.checked = false;
  });
  dom.deviationLimit.value = "2";
  dom.deviationLabel.textContent = "±2 DE";
  renderAll();
}

function selectParameter(parameterKey) {
  clearMulti(dom.parameterFilter);
  selectValues(dom.parameterFilter, [parameterKey]);
  renderAll();
}

function selectRioParaguay() {
  dom.componentFilter.value = "Industrial";
  dom.mediumFilter.value = "Agua superficial";
  dom.waterBodyFilter.value = "Río Paraguay";
  clearMulti(dom.pointFilter);
  const rioPoints = pointCatalog.filter((row) => row.water_body === "Río Paraguay").map(pointId);
  selectValues(dom.pointFilter, rioPoints);
  renderAll();
}

function testApproaches(row) {
  const tags = new Set();
  if (String(row.group || "").match(/camp/i)) tags.add("Enfoque 1 · Por Campaña");
  if (row.grouping === "year" || String(row.group || "").match(/20\d{2}/)) tags.add("Enfoque 2 · En el Tiempo");
  tags.add("Enfoque 3 · Evolución del Programa");
  return [...tags];
}

function classifyFlowFromGroup(group) {
  const value = String(group || "").toUpperCase().replaceAll(" ", "");
  if (value === "FW01-PY" || value === "FW01PY") return "Entrada";
  if (value === "FW02-PY" || value === "FW02PY") return "Medio";
  if (value === "FW03-PY" || value === "FW03PY") return "Salida";
  if (value.startsWith("GW")) return "Pozo";
  return "No clasificado";
}

function buildXLabels(rows) {
  const labels = unique(rows.map((row) => row.year || row.period || "Sin periodo"));
  return labels.sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
    return String(a).localeCompare(String(b), "es");
  }).map(String);
}

function groupForChart(rows, xLabels, normalize) {
  const limit = Number(dom.deviationLimit.value);
  const map = new Map();
  rows.forEach((row) => {
    const label = `${row.parameter} · ${row.point}`;
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(row);
  });
  return [...map.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([label, rawRows]) => {
      const firstValue = rawRows.find((row) => numeric(row.value))?.value || 1;
      const points = xLabels.map((xLabel, xIndex) => {
        const row = rawRows.find((item) => String(item.year || item.period || "Sin periodo") === xLabel);
        if (!row || !numeric(row.value)) return { xIndex, y: null, alert: false };
        const y = normalize ? (row.value / firstValue) * 100 : row.value;
        return { xIndex, y, alert: numeric(row.deviation_score) && Math.abs(row.deviation_score) >= limit };
      });
      return { label, points, rawRows };
    })
    .slice(0, 10);
}

function flaggedRows(rows) {
  const limit = Number(dom.deviationLimit.value);
  return rows
    .filter((row) => numeric(row.deviation_score) && Math.abs(row.deviation_score) >= limit)
    .sort((a, b) => Math.abs(b.deviation_score) - Math.abs(a.deviation_score));
}

function buildPointCatalog(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const id = rowPointId(row);
    if (!map.has(id)) {
      map.set(id, {
        component: row.component,
        medium: row.medium,
        water_body: row.water_body,
        point: row.point,
        point_type: row.point_type,
        sheet_tab_color: row.sheet_tab_color,
        sheet_tab_color_label: row.sheet_tab_color_label,
        point_type_source: row.point_type_source,
        years: new Set(),
        parameters: new Set(),
        approaches: new Set(),
        comparable_records: 0,
        comparable: false,
      });
    }
    const item = map.get(id);
    if (row.year) item.years.add(row.year);
    item.parameters.add(row.parameter_key);
    (row.approaches || []).forEach((approach) => item.approaches.add(approach));
    if (row.comparable) {
      item.comparable_records += 1;
      item.comparable = true;
    }
  });
  return [...map.values()]
    .map((item) => ({
      ...item,
      years: [...item.years].sort(),
      approaches: [...item.approaches].sort(),
      parameters_count: item.parameters.size,
    }))
    .sort((a, b) => pointId(a).localeCompare(pointId(b), "es"));
}

function applyOverrides(rows) {
  return rows.map((row) => {
    const id = rowPointId(row);
    const patch = overrides.points[id];
    return patch ? { ...row, ...patch } : row;
  });
}

function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(overrideKey)) || { points: {} };
  } catch {
    return { points: {} };
  }
}

function saveOverrides() {
  localStorage.setItem(overrideKey, JSON.stringify(overrides));
}

function resetOverrides() {
  overrides = { points: {} };
  saveOverrides();
  location.reload();
}

function renderTable(selector, headers, rows) {
  const table = document.querySelector(selector);
  table.innerHTML = `<thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  wireInfoButtons(table);
}

function readingCard(title, text) {
  return `<div class="reading-card"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></div>`;
}

function lineEl(x1, y1, x2, y2, cls, stroke) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  if (cls) line.setAttribute("class", cls);
  if (stroke) line.setAttribute("stroke", stroke);
  return line;
}

function textEl(x, y, text, cls, anchor = "start") {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("class", cls);
  el.setAttribute("text-anchor", anchor);
  el.textContent = text;
  return el;
}

function chip(type) {
  const cls = ["Entrada", "Medio", "Salida", "Pozo"].includes(type) ? type : "Neutral";
  return `<span class="chip ${cls}">${escapeHtml(type || "Sin clasificar")}</span>`;
}

function colorLabel(row) {
  const color = /^#[0-9a-f]{6}$/i.test(row.point_color || "") ? row.point_color : row.sheet_tab_color;
  const swatch = /^#[0-9a-f]{6}$/i.test(color || "") ? `<span class="color-swatch" style="background:${escapeAttr(color)}"></span>` : "";
  return `${swatch}<span>${escapeHtml(row.sheet_tab_color_label || "sin color")}</span><br><small>${escapeHtml(row.point_type_source || "")}</small>`;
}

function sourceLabel(source) {
  if (!source) return "";
  const row = source.row ? `:${source.row}` : "";
  return `<span class="source">${escapeHtml(source.file)} · ${escapeHtml(source.sheet)}${row}</span>`;
}

function pointId(row) {
  return `${row.component}|${row.medium}|${row.water_body}|${row.point}`;
}

function rowPointId(row) {
  return `${row.component}|${row.medium}|${row.water_body}|${row.point}`;
}

function periodLabel(row) {
  return row.year || row.period || "Sin periodo";
}

function selectedValues(select) {
  return [...select.selectedOptions].map((option) => option.value).filter(Boolean);
}

function selectedLabel(select) {
  const option = select?.selectedOptions?.[0];
  return option?.value ? option.textContent || option.label || option.value : "";
}

function selectedLabels(select, limit = 2) {
  const labels = [...(select?.selectedOptions || [])]
    .filter((option) => option.value)
    .map((option) => option.textContent || option.label || option.value);
  if (!labels.length) return "";
  const visible = labels.slice(0, limit).join(", ");
  return labels.length > limit ? `${visible} +${labels.length - limit}` : visible;
}

function selectValues(select, values) {
  const set = new Set(values);
  [...select.options].forEach((option) => {
    option.selected = set.has(option.value);
  });
}

function clearMulti(select) {
  [...select.options].forEach((option) => {
    option.selected = false;
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "es"));
}

function countBy(rows, getter) {
  const counts = new Map();
  rows.forEach((row) => {
    const label = getter(row);
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || String(a.label).localeCompare(String(b.label), "es"));
}

function numeric(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumber(value) {
  if (!numeric(value)) return "";
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: Math.abs(value) >= 100 ? 1 : 3 }).format(value);
}

function formatFixed(value, digits = 1) {
  if (!numeric(value)) return "";
  return new Intl.NumberFormat("es-PY", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

function formatP(value) {
  if (!numeric(value)) return "";
  return value < 0.0001 ? "<0,0001" : formatNumber(value);
}

function formatPercent(value) {
  if (!numeric(value)) return "";
  return new Intl.NumberFormat("es-PY", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function formatInt(value) {
  return new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(value || 0);
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-PY", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatCount(value) {
  return numeric(value) ? formatNumber(value) : "";
}

function representativenessText(nValue) {
  const n = Number(nValue || 0);
  if (!n) return "Sin n suficiente";
  if (n < 2) return "Dato aislado";
  if (n < 5) return "Muestra pequeña";
  if (n < 10) return "Muestra moderada";
  return "Soporte adecuado";
}

function setText(selector, text) {
  document.querySelector(selector).textContent = text;
}

function downloadCsv(rows, filename) {
  const headers = ["component", "medium", "water_body", "point", "point_type", "parameter", "period", "n", "value", "sd", "comparable", "source_file", "source_sheet", "source_row"];
  const body = rows.map((row) =>
    headers
      .map((key) => {
        const value = key.startsWith("source_") ? row.source?.[key.replace("source_", "")] : row[key];
        return `"${String(value ?? "").replaceAll('"', '""')}"`;
      })
      .join(","),
  );
  downloadBlob([headers.join(","), ...body].join("\n"), filename, "text/csv;charset=utf-8");
}

function downloadJson(payload, filename) {
  downloadBlob(JSON.stringify(payload, null, 2), filename, "application/json;charset=utf-8");
}

function downloadBlob(text, filename, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
