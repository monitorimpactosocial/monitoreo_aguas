// =============================================================
// PARACEL S.A. — Monitoreo de Calidad del Agua Superficial
// Área de Sustentabilidad Ambiental | Programa PR-SA-F04
// =============================================================

const SS_ID = '1VmBLNbeUCW1GtxrXz3zsUQl0HdRqc5SSUBdtMywql4U';

// Column headers — BD_PRINCIPAL (must match Google Sheet exactly)
const BD_HEADERS = [
  'ID_Muestra','Punto_ID','Subcuenca','Estado_Punto','Año','Temporada','Cod_Temporada',
  'Fecha_Muestreo','Responsable',
  // Fisicoquímicos (22)
  'Temperatura','Color','pH','Conductividad','OD','Turbidez',
  'Mat_Flotantes','TDS','Aceites_Grasas','DBO5',
  'Fosforo_Total','Nitrogeno_Total','Nitratos','Amoniaco','Nitritos',
  'Aluminio','Hierro_Soluble','Clorofila_A','Calcio','Potasio','SST','Magnesio',
  // Microbiológicos (3)
  'Coliformes_Totales','Coliformes_Fecales','E_coli',
  // Agroquímicos (9)
  'Glifosato','AMPA','Tebuconazole','Sulfluramida','Glufosinato',
  'Flumioxazin','Fipronil','Isoxaflutole','Haloxifop',
  // Cumplimiento
  'DL','FL','Total_Evaluados','Pct_Cumplimiento','Observaciones'
];

// Active monitoring points with approximate WGS84 coordinates
// (Converted from UTM Zone 21S / EPSG:32721)
const PUNTOS_ACTIVOS = [
  {id:'FW 104-ZA',      sub:'Negla',       lat:-22.34, lng:-56.55, estado:'Activo'},
  {id:'FW 190-ST',      sub:'Negla',       lat:-22.44, lng:-56.62, estado:'Activo'},
  {id:'FW 320-ST',      sub:'Negla',       lat:-22.52, lng:-56.69, estado:'Activo'},
  {id:'FW 191-ST',      sub:'Napegue',     lat:-22.43, lng:-56.49, estado:'Activo'},
  {id:'FW 391-ST',      sub:'Napegue',     lat:-22.52, lng:-56.58, estado:'Activo'},
  {id:'FW 102-SL',      sub:'Trementina',  lat:-22.44, lng:-56.90, estado:'Activo'},
  {id:'FW 208-TR',      sub:'Trementina',  lat:-22.60, lng:-56.86, estado:'Activo'},
  {id:'FW 109-MYRZ',    sub:'Trementina',  lat:-22.69, lng:-56.92, estado:'Activo'},
  {id:'FW 113-RC',      sub:'Trementina',  lat:-22.64, lng:-56.98, estado:'Activo'},
  {id:'FW 317-RZ',      sub:'Trementina',  lat:-22.84, lng:-56.97, estado:'Activo'},
  {id:'FW 107-HE',      sub:'Hermosa',     lat:-22.32, lng:-56.94, estado:'Activo'},
  {id:'FW 322-HE',      sub:'Hermosa',     lat:-22.25, lng:-56.85, estado:'Activo'},
  {id:'FW 210-ZM',      sub:'Zapiquem',    lat:-22.47, lng:-57.07, estado:'Activo'},
  {id:'FW 130-SO',      sub:'Itasilla',    lat:-22.46, lng:-57.11, estado:'Activo'},
  {id:'FW 230-VS',      sub:'Pitanohaga',  lat:-22.60, lng:-57.10, estado:'Activo'},
  {id:'FW 318-VS',      sub:'Pitanohaga',  lat:-22.72, lng:-57.13, estado:'Activo'},
  {id:'FW 316-CR',      sub:'Aquidaban',   lat:-22.98, lng:-57.14, estado:'Activo'},
  {id:'FW 321-CR',      sub:'Aquidaban',   lat:-22.99, lng:-57.12, estado:'Activo'},
  {id:'FW 106-DG',      sub:'Pitanohaga',  lat:-22.80, lng:-57.30, estado:'Activo'},
  {id:'FW 326-DG',      sub:'Pitanohaga',  lat:-22.85, lng:-57.35, estado:'Activo'},
];

// Known compliance data per year/season (historical)
const CUMPL_HISTORICO = [
  {anio:2021,temp:'RS',nPuntos:18,dl:698,fl:76,total:774,pct:90.18},
  {anio:2021,temp:'DS',nPuntos:14,dl:556,fl:46,total:602,pct:92.36},
  {anio:2022,temp:'RS',nPuntos:12,dl:462,fl:54,total:516,pct:89.53},
  {anio:2022,temp:'DS',nPuntos:11,dl:422,fl:51,total:473,pct:89.22},
  {anio:2023,temp:'RS',nPuntos:17,dl:617,fl:114,total:731,pct:84.40},
  {anio:2023,temp:'DS',nPuntos:19,dl:749,fl:68,total:817,pct:91.68},
  {anio:2024,temp:'RS',nPuntos:16,dl:171,fl:53,total:224,pct:76.34},
  {anio:2024,temp:'DS',nPuntos:16,dl:168,fl:88,total:256,pct:65.63},
  {anio:2025,temp:'RS',nPuntos:20,dl:242,fl:98,total:340,pct:71.18},
  {anio:2025,temp:'DS',nPuntos:20,dl:258,fl:62,total:320,pct:80.63},
];

// =====================================================================
// HTTP ENTRY POINT
// =====================================================================

function doGet(e) {
  initializeSheets_();
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setTitle('Monitoreo de Aguas — PARACEL S.A.')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================================
// SHEET INITIALIZATION
// =====================================================================

function initializeSheets_() {
  try {
    const ss = SpreadsheetApp.openById(SS_ID);

    // BD_PRINCIPAL
    if (!ss.getSheetByName('BD_PRINCIPAL')) {
      const sh = ss.insertSheet('BD_PRINCIPAL');
      sh.appendRow(BD_HEADERS);
      const headerRange = sh.getRange(1, 1, 1, BD_HEADERS.length);
      headerRange.setFontWeight('bold')
        .setBackground('#1F4E79')
        .setFontColor('#FFFFFF')
        .setHorizontalAlignment('center');
      sh.setFrozenRows(1);
      sh.setColumnWidth(1, 200); // ID_Muestra wider
    }

    // PUNTOS
    if (!ss.getSheetByName('PUNTOS')) {
      const sh = ss.insertSheet('PUNTOS');
      const headers = ['Punto_ID','Subcuenca','Estado','Lat','Lng','Anio_Inicio','Observaciones'];
      sh.appendRow(headers);
      PUNTOS_ACTIVOS.forEach(p =>
        sh.appendRow([p.id, p.sub, p.estado, p.lat, p.lng, 2021, ''])
      );
      sh.getRange(1,1,1,7)
        .setFontWeight('bold').setBackground('#1F4E79').setFontColor('#FFFFFF');
      sh.setFrozenRows(1);
    }
  } catch(err) {
    console.error('initializeSheets_:', err);
  }
}

// =====================================================================
// DATA ACCESS FUNCTIONS
// =====================================================================

/**
 * Returns all records from BD_PRINCIPAL as array of objects.
 */
function getAllRecords() {
  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    const sh = ss.getSheetByName('BD_PRINCIPAL');
    if (!sh || sh.getLastRow() < 2) return { success: true, data: [] };

    const vals = sh.getDataRange().getValues();
    const headers = vals[0].map(String);

    return {
      success: true,
      data: vals.slice(1).map(row => {
        const rec = {};
        headers.forEach((h, i) => { rec[h] = row[i]; });
        return rec;
      })
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Returns the last N records (newest first).
 */
function getLastRecords(n) {
  try {
    const result = getAllRecords();
    if (!result.success) return result;
    const data = result.data.slice(-n).reverse();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Returns all monitoring points (from PUNTOS sheet, fallback to hardcoded).
 */
function getPuntos() {
  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    const sh = ss.getSheetByName('PUNTOS');
    if (!sh || sh.getLastRow() < 2) return { success: true, data: PUNTOS_ACTIVOS };

    const vals = sh.getDataRange().getValues();
    const headers = vals[0].map(String);
    const data = vals.slice(1).map(row => {
      const p = {};
      headers.forEach((h, i) => { p[h] = row[i]; });
      return p;
    });
    return { success: true, data };
  } catch (err) {
    return { success: true, data: PUNTOS_ACTIVOS };
  }
}

/**
 * Saves a new record to BD_PRINCIPAL.
 * @param {Object} data - Record object keyed by BD_HEADERS column names.
 */
function saveRecord(data) {
  try {
    const ss = SpreadsheetApp.openById(SS_ID);
    let sh = ss.getSheetByName('BD_PRINCIPAL');

    if (!sh) {
      sh = ss.insertSheet('BD_PRINCIPAL');
      sh.appendRow(BD_HEADERS);
      sh.getRange(1,1,1,BD_HEADERS.length)
        .setFontWeight('bold').setBackground('#1F4E79').setFontColor('#FFFFFF');
      sh.setFrozenRows(1);
    }

    // Get actual headers from sheet (in case columns were reordered)
    const sheetHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

    // Build row matching sheet column order
    const row = sheetHeaders.map(h => (data[h] !== undefined && data[h] !== null) ? data[h] : '');

    // Calculate ID if not provided
    if (!row[0]) {
      const cod = data['Cod_Temporada'] || (data['Temporada'] === 'Seca' ? 'DS' : 'RS');
      const pid = String(data['Punto_ID'] || '').replace(/\s+/g, '-');
      row[0] = `${pid}-${data['Año']}-${cod}`;
    }

    sh.appendRow(row);

    // Alternate row shading
    const lastRow = sh.getLastRow();
    if (lastRow % 2 === 0) {
      sh.getRange(lastRow, 1, 1, sheetHeaders.length).setBackground('#DEEAF1');
    }

    return { success: true, message: `Registro "${row[0]}" guardado correctamente.` };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Returns aggregated statistics for the dashboard.
 */
function getStats() {
  try {
    const result = getAllRecords();
    const sheetRecords = result.success ? result.data : [];

    // Merge historical compliance (from constants) + sheet records
    // Sheet records override historical if same year/season exist
    const byYS = {};
    CUMPL_HISTORICO.forEach(h => {
      byYS[`${h.anio}-${h.temp}`] = { anio: h.anio, temp: h.temp, dl: h.dl, fl: h.fl, total: h.total, pct: h.pct, nPuntos: h.nPuntos };
    });

    // Aggregate from sheet if data exists
    if (sheetRecords.length > 0) {
      const sheetByYS = {};
      sheetRecords.forEach(r => {
        const yr = Number(r['Año']) || 0;
        const cod = String(r['Cod_Temporada'] || (r['Temporada']==='Seca'?'DS':'RS'));
        const key = `${yr}-${cod}`;
        if (!sheetByYS[key]) sheetByYS[key] = { anio: yr, temp: cod, dl: 0, fl: 0, count: 0 };
        sheetByYS[key].dl   += Number(r['DL']) || 0;
        sheetByYS[key].fl   += Number(r['FL']) || 0;
        sheetByYS[key].count++;
      });
      Object.entries(sheetByYS).forEach(([k, v]) => {
        const total = v.dl + v.fl;
        byYS[k] = { anio: v.anio, temp: v.temp, dl: v.dl, fl: v.fl,
                    total, pct: total>0 ? Math.round(v.dl/total*1000)/10 : null,
                    nPuntos: v.count };
      });
    }

    // By subcuenca (from sheet)
    const bySub = {};
    sheetRecords.forEach(r => {
      const sub = r['Subcuenca'] || 'N/D';
      if (!bySub[sub]) bySub[sub] = { dl: 0, fl: 0 };
      bySub[sub].dl += Number(r['DL']) || 0;
      bySub[sub].fl += Number(r['FL']) || 0;
    });

    // By punto — last compliance value
    const byPunto = {};
    sheetRecords.forEach(r => {
      const p = r['Punto_ID'];
      if (!p) return;
      if (!byPunto[p]) byPunto[p] = { sub: r['Subcuenca'], count: 0, lastPct: null };
      byPunto[p].count++;
      const pct = Number(r['Pct_Cumplimiento']);
      if (!isNaN(pct) && pct > 0) byPunto[p].lastPct = pct;
    });

    // Parameter non-compliance frequency (from sheet)
    const PARAM_COLS = ['pH','OD','Turbidez','DBO5','Fosforo_Total','Nitrogeno_Total',
      'Nitratos','Amoniaco','Nitritos','Aluminio','Hierro_Soluble',
      'Coliformes_Totales','Coliformes_Fecales','E_coli'];
    const PARAM_LIMITS = { pH:[6,9], OD:[5,null], Turbidez:[null,100], DBO5:[null,5],
      Fosforo_Total:[null,0.05], Nitrogeno_Total:[null,0.6], Nitratos:[null,10],
      Amoniaco:[null,0.02], Nitritos:[null,1], Aluminio:[null,0.2],
      Hierro_Soluble:[null,0.3], Coliformes_Fecales:[null,1000] };

    const paramIncumpl = {};
    sheetRecords.forEach(r => {
      PARAM_COLS.forEach(p => {
        const raw = r[p];
        const v = parseFloat(String(raw).replace(',','.').replace('<','').replace('>',''));
        if (isNaN(v)) return;
        const lim = PARAM_LIMITS[p];
        if (!lim) return;
        const [min, max] = lim;
        const isOut = (min !== null && v < min) || (max !== null && v > max);
        if (isOut) paramIncumpl[p] = (paramIncumpl[p] || 0) + 1;
      });
    });

    // Time series for key params (pH, OD, Turbidez)
    const timeSeries = {};
    sheetRecords.forEach(r => {
      const yr = Number(r['Año']);
      const cod = r['Cod_Temporada'] || 'RS';
      const key = `${yr}-${cod}`;
      if (!timeSeries[key]) timeSeries[key] = { key, yr, cod, vals: {} };
      ['pH','OD','Turbidez','DBO5'].forEach(p => {
        const v = parseFloat(String(r[p] || '').replace(',','.').replace('<','').replace('>',''));
        if (!isNaN(v)) {
          if (!timeSeries[key].vals[p]) timeSeries[key].vals[p] = [];
          timeSeries[key].vals[p].push(v);
        }
      });
    });

    // Compliance time series — combine historical + sheet
    const cumplTS = Object.values(byYS)
      .sort((a,b) => a.anio-b.anio || (a.temp==='RS'?-1:1))
      .map(d => ({ label: `${d.anio} ${d.temp}`, pct: d.pct, nPuntos: d.nPuntos,
                   dl: d.dl, fl: d.fl, total: d.total }));

    return {
      success: true,
      totalRecords: sheetRecords.length,
      totalPuntos: Object.keys(byPunto).length || PUNTOS_ACTIVOS.length,
      cumplTS,
      bySub: Object.entries(bySub).map(([sub, v]) => ({
        sub,
        pct: v.dl+v.fl>0 ? Math.round(v.dl/(v.dl+v.fl)*1000)/10 : null
      })),
      byPunto: Object.entries(byPunto).map(([p, v]) => ({
        punto: p, sub: v.sub, count: v.count, lastPct: v.lastPct
      })),
      paramIncumpl: Object.entries(paramIncumpl)
        .sort((a,b) => b[1]-a[1])
        .map(([p,n]) => ({ param: p, n })),
      timeSeries: Object.values(timeSeries).sort((a,b) => a.yr-b.yr),
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Returns all compliance data per monitoring point for the map popup.
 */
function getPuntosConCumplimiento() {
  try {
    const result = getAllRecords();
    if (!result.success || result.data.length === 0) {
      // Return points with no compliance data
      return { success: true, data: PUNTOS_ACTIVOS.map(p => ({ ...p, lastPct: null, lastYear: null })) };
    }

    // Get last pct per punto
    const lastByPunto = {};
    result.data.forEach(r => {
      const p = r['Punto_ID'];
      const yr = Number(r['Año']) || 0;
      if (!lastByPunto[p] || yr > lastByPunto[p].yr) {
        lastByPunto[p] = { yr, pct: Number(r['Pct_Cumplimiento']) || null };
      }
    });

    const puntos = PUNTOS_ACTIVOS.map(p => ({
      ...p,
      lastPct: lastByPunto[p.id] ? lastByPunto[p.id].pct : null,
      lastYear: lastByPunto[p.id] ? lastByPunto[p.id].yr : null,
    }));

    return { success: true, data: puntos };
  } catch (err) {
    return { success: false, error: err.toString(), data: PUNTOS_ACTIVOS };
  }
}
