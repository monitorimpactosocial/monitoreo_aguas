const DATA = window.MONITORING_DATA || {};

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

let overrides = loadOverrides();
let activeView = "dashboard";

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

init();

function init() {
  populateFilters();
  bindEvents();
  renderGuide();
  renderAll();
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  Object.values(dom).forEach((element) => {
    if (element) element.addEventListener("change", renderAll);
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
  document.querySelector("#closeNote").addEventListener("click", () => {
    document.querySelector("#notePanel").hidden = true;
  });
  wireInfoButtons(document);
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
  const rows = filteredSeries();
  renderMetrics(rows);
  renderChart(rows);
  renderSummaryFigures(rows);
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
  if (activeView === "edit") renderEditTable();
}

function renderMetrics(rows) {
  const alerts = flaggedRows(rows);
  setText("#metricSeries", formatInt(rows.length));
  setText("#metricSeriesSub", `${formatInt(rows.filter((row) => row.comparable).length)} comparables`);
  setText("#metricPoints", formatInt(unique(rows.map((row) => rowPointId(row))).length));
  setText("#metricParams", formatInt(unique(rows.map((row) => row.parameter_key)).length));
  setText("#metricAlerts", formatInt(alerts.length));
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

function renderChart(rows) {
  const svg = document.querySelector("#trendChart");
  const chartRows = rows.filter((row) => numeric(row.value));
  svg.innerHTML = "";
  const width = 1000;
  const height = 460;
  const margin = { top: 50, right: 28, bottom: 58, left: 70 };
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  if (!chartRows.length) {
    svg.append(textEl(width / 2, height / 2, "No hay valores numéricos para el filtro actual", "chart-title", "middle"));
    document.querySelector("#chartMode").textContent = "sin datos";
    return;
  }

  const parameterCount = unique(chartRows.map((row) => row.parameter_key)).length;
  const normalize = parameterCount > 1;
  document.querySelector("#chartMode").textContent = normalize ? "base 100 por serie" : "valores reales";

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

function renderEditTable() {
  renderTable("#editTable", ["Componente", "Medio", "Cauce", "Punto", "Clasificación", "Años", "Parámetros"], buildPointCatalog(filteredSeries()).map((row) => {
    const id = pointId(row);
    const select = `<select data-edit-point="${escapeAttr(id)}">${pointTypes.map((type) => `<option value="${escapeAttr(type)}" ${row.point_type === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}</select>`;
    return [row.component, row.medium, row.water_body, row.point, select, row.years?.join(", ") || "Consolidado", formatInt(row.parameters_count)];
  }));
  document.querySelectorAll("[data-edit-point]").forEach((select) => {
    select.addEventListener("change", () => {
      overrides.points[select.dataset.editPoint] = { point_type: select.value };
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
