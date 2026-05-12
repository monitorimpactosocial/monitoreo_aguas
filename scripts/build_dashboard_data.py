from __future__ import annotations

import json
import math
import re
import statistics
import unicodedata
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
APP_DIR = ROOT / "app"

POINT_TYPE_META = {
    "Entrada": {
        "point_color": "#C62828",
        "sheet_tab_color": "#C62828",
        "sheet_tab_color_label": "rojo",
        "point_type_source": "clasificacion por color de pestana: rojo=entrada",
    },
    "Salida": {
        "point_color": "#2E7D32",
        "sheet_tab_color": "#2E7D32",
        "sheet_tab_color_label": "verde",
        "point_type_source": "clasificacion por color de pestana: verde=salida",
    },
    "Medio": {
        "point_color": "#F9A825",
        "sheet_tab_color": "#F9A825",
        "sheet_tab_color_label": "amarillo",
        "point_type_source": "clasificacion por color de pestana: amarillo=intermedio",
    },
    "Pozo": {
        "point_color": "#2F6FA3",
        "sheet_tab_color": "#2F6FA3",
        "sheet_tab_color_label": "azul",
        "point_type_source": "clasificacion operativa: pozo",
    },
    "No clasificado": {
        "point_color": None,
        "sheet_tab_color": None,
        "sheet_tab_color_label": "sin color local",
        "point_type_source": "pendiente de recuperar color de pestana del Google Sheet",
    },
    "Sin clasificar": {
        "point_color": None,
        "sheet_tab_color": None,
        "sheet_tab_color_label": "sin color local",
        "point_type_source": "pendiente de recuperar color de pestana del Google Sheet",
    },
}

RIO_PARAGUAY_SOURCES = [
    {
        "role": "Resumen por puntos de muestreo",
        "file": "Anexos\\Agua superficial\\Industrial\\REsultados compilados Rio PAraguay_ todos los parametros.xlsx",
        "sheet": "Comparación puntos_muestreo",
    },
    {
        "role": "Kruskal-Wallis entre puntos",
        "file": "Anexos\\Agua superficial\\Industrial\\Resultados Kruskall Wallis.xlsx",
        "sheet": "Sheet1",
    },
    {
        "role": "Kruskal-Wallis por años fisicoquímicos",
        "file": "Anexos\\Agua superficial\\Industrial\\Kruskal Wallis_AÑOS_FISICOQUIMICOS.xlsx",
        "sheet": "Sheet1",
    },
    {
        "role": "Normalidad Shapiro-Wilk",
        "file": "Anexos\\Agua superficial\\Industrial\\SHAPIRO_FW_RIOPY.xlsx",
        "sheet": "Sheet1",
    },
    {
        "role": "Pesticidas entre campañas",
        "file": "Anexos\\Agua superficial\\Industrial\\KruskalWallis_PesticidasRioPY_entre campañas.xlsx",
        "sheet": "Sheet1",
    },
]


def strip_accents(text: str) -> str:
    return "".join(
        char
        for char in unicodedata.normalize("NFKD", text)
        if not unicodedata.combining(char)
    )


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    text = str(value).replace("\xa0", " ").strip()
    text = re.sub(r"\s+", " ", text)
    return text


def normalize_label(value: Any) -> str:
    text = clean_text(value)
    text = text.replace("_", " ").replace("&", " y ")
    text = re.sub(r"\s+", " ", text).strip()
    replacements = {
        "Potencial de Hidrogeno": "pH",
        "Potencial de Hidrógeno": "pH",
        "Conductividad Electrica": "Conductividad eléctrica",
        "Conductividad Eléctrica": "Conductividad eléctrica",
        "Solidos disueltos totales": "Sólidos disueltos totales",
        "Sólidos disueltos totales": "Sólidos disueltos totales",
        "P total": "Fósforo total",
        "P_total": "Fósforo total",
        "N total": "Nitrógeno total",
        "N_total": "Nitrógeno total",
        "M.O.": "Materia orgánica",
        "Aceites": "Aceites y grasas",
        "Aceites y grasas": "Aceites y grasas",
        "Aceites grasas": "Aceites y grasas",
        "Aceites&grasas": "Aceites y grasas",
        "Conductividad": "Conductividad eléctrica",
        "Temperatura": "Temperatura del agua",
        "O.D.": "Oxígeno disuelto",
        "TDS": "Sólidos disueltos totales",
        "DBO5": "Demanda biológica de oxígeno",
        "DQO": "Demanda química de oxígeno",
        "Demanda biológica de oxige..": "Demanda biológica de oxígeno",
        "Demanda química de oxigeno..": "Demanda química de oxígeno",
        "Nitrogeno": "Nitrógeno total",
        "Materiales flot": "Materiales flotantes",
        "Nivel freatico": "Nivel freático",
        "Hierro II": "Hierro soluble",
        "Hierro-II": "Hierro soluble",
    }
    key = strip_accents(text)
    for original, normalized in replacements.items():
        if strip_accents(original).lower() == key.lower():
            return normalized
    if text.lower() in {"ph", "p h"}:
        return "pH"
    if text.upper() in {"DBO", "DBO5", "DQO", "SDT"}:
        return text.upper()
    return text


def slug(value: str) -> str:
    text = strip_accents(value).lower()
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    return text or "sin_etiqueta"


def to_number(value: Any) -> float | None:
    text = clean_text(value)
    if not text:
        return None
    text = text.replace("<", "").replace(">", "")
    text = text.replace(" ", "")
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


def to_year(value: Any) -> int | None:
    text = clean_text(value)
    match = re.search(r"(20\d{2})", text)
    if match:
        return int(match.group(1))
    number = to_number(value)
    if number and 2000 <= number <= 2099:
        return int(number)
    return None


def years_from_period(period: Any) -> list[int]:
    text = clean_text(period)
    match = re.search(r"(20\d{2})\s*[-/]\s*(20\d{2})", text)
    if match:
        start = int(match.group(1))
        end = int(match.group(2))
        if start <= end:
            return list(range(start, end + 1))
    year = to_year(text)
    return [year] if year else []


def find_file(name: str) -> Path:
    matches = list(ROOT.rglob(name))
    if not matches:
        raise FileNotFoundError(name)
    return matches[0]


def classify_point(point: str, water_body: str = "") -> str:
    normalized = strip_accents(point).upper().replace(" ", "")
    if normalized in {"FW01-PY", "FW01PY"}:
        return "Entrada"
    if normalized in {"FW02-PY", "FW02PY"}:
        return "Medio"
    if normalized in {"FW03-PY", "FW03PY"}:
        return "Salida"
    if normalized.startswith("GW"):
        return "Pozo"
    if water_body and strip_accents(water_body).lower() in {"rio paraguay", "río paraguay"}:
        return "Sin clasificar"
    return "No clasificado"


def point_type_meta(point_type: str) -> dict[str, Any]:
    return POINT_TYPE_META.get(point_type, POINT_TYPE_META["No clasificado"]).copy()


def approach_tags(row: dict[str, Any]) -> list[str]:
    tags: set[str] = set()
    value_kind = clean_text(row.get("value_kind")).lower()
    period_years = years_from_period(row.get("period"))
    if value_kind in {"raw", "aggregated_raw"} or "campaña" in clean_text(row.get("campaign")).lower():
        tags.add("Enfoque 1 · Por Campaña")
    if row.get("year") is not None or len(period_years) > 1 or "by_year" in value_kind:
        tags.add("Enfoque 2 · En el Tiempo")
    if row.get("comparable") or "consolidado" in clean_text(row.get("point")).lower() or "summary" in value_kind or "stat" in value_kind:
        tags.add("Enfoque 3 · Evolución del Programa")
    return sorted(tags) or ["Enfoque 2 · En el Tiempo"]


def representativeness_note(n_value: Any, comparable: bool = False) -> str:
    n = float(n_value or 0)
    if n <= 0:
        return "Sin n suficiente: revisar fuente antes de interpretar."
    if n < 2:
        return "Dato aislado: uso descriptivo, sin prueba estadistica."
    if n < 5:
        return "Muestra pequena: priorizar prueba no parametrica o permutacion y leer con cautela."
    if n < 10:
        return "Muestra moderada: comparar junto con dispersion y consistencia del punto."
    if comparable:
        return "Soporte adecuado para comparacion dentro de la regla operativa."
    return "Soporte descriptivo adecuado; verificar comparabilidad del punto."


def small_sample_test_note(n_value: Any) -> str:
    n = float(n_value or 0)
    if n < 2:
        return "No aplica prueba inferencial."
    if n < 5:
        return "Sugerido: Kruskal-Wallis/Mann-Whitney exacta o prueba por permutacion."
    return "Sugerido: Shapiro-Wilk; ANOVA si normalidad compatible, Kruskal-Wallis si no."


def source_ref(path: Path, sheet: str, row: int | None = None) -> dict[str, Any]:
    ref = {"file": str(path.relative_to(ROOT)), "sheet": sheet}
    if row is not None:
        ref["row"] = row
    return ref


raw_records: list[dict[str, Any]] = []
statistical_tests: list[dict[str, Any]] = []


def add_record(**kwargs: Any) -> None:
    point = normalize_label(kwargs.get("point", ""))
    parameter = normalize_label(kwargs.get("parameter", ""))
    water_body = normalize_label(kwargs.get("water_body", ""))
    kwargs["point"] = point
    kwargs["parameter"] = parameter
    kwargs["parameter_key"] = slug(parameter)
    kwargs["water_body"] = water_body
    kwargs["point_type"] = kwargs.get("point_type") or classify_point(point, water_body)
    kwargs.update({k: kwargs.get(k, v) for k, v in point_type_meta(kwargs["point_type"]).items()})
    raw_records.append(kwargs)


def parse_rio_paraguay_point_summary() -> None:
    path = find_file("REsultados compilados Rio PAraguay_ todos los parametros.xlsx")
    sheet = "Comparación puntos_muestreo"
    df = pd.read_excel(path, sheet_name=sheet, header=0, dtype=object)
    current_param = ""
    current_category = ""
    for idx, row in df.iterrows():
        param_cell = normalize_label(row.get("PARÁMETROS", ""))
        point = clean_text(row.get("Puntos de muestreo", ""))
        if param_cell and not point.upper().startswith("FW"):
            current_category = param_cell
            continue
        if param_cell:
            current_param = param_cell
        if not current_param or not point.upper().startswith("FW"):
            continue
        add_record(
            component="Industrial",
            medium="Agua superficial",
            water_body="Río Paraguay",
            point=point,
            parameter=current_param,
            year=None,
            period="2019-2023",
            campaign="Consolidado",
            n=to_number(row.get("N")),
            mean=to_number(row.get("Promedio")),
            sd=to_number(row.get("Desviación estándar")),
            median=to_number(row.get("Medianas")),
            value=None,
            category=current_category,
            value_kind="summary_by_point",
            source=source_ref(path, sheet, int(idx) + 2),
        )


def parse_repeated_stat_table(
    filename: str,
    *,
    component: str,
    medium: str,
    water_body: str,
    grouping: str,
    value_kind: str,
) -> None:
    path = find_file(filename)
    sheet = pd.ExcelFile(path).sheet_names[0]
    df = pd.read_excel(path, sheet_name=sheet, header=None, dtype=object)
    for idx, row in df.iterrows():
        cells = [clean_text(value) for value in row.tolist()]
        if len(cells) < 8:
            continue
        parameter = normalize_label(cells[0])
        variable = normalize_label(cells[1])
        group_value = clean_text(cells[2])
        if not parameter or parameter.lower() in {
            "parametro",
            "parámetros",
            "parametros",
            "prueba",
            "trat.",
            "medias",
            "columna1",
        }:
            continue
        if not group_value:
            continue
        year = to_year(group_value)
        point = None
        if grouping == "year":
            if year is None:
                continue
            point = f"{water_body} consolidado"
        else:
            if not re.search(r"[A-Za-z]{1,4}\d", group_value):
                continue
            point = group_value
        n_value = to_number(cells[3])
        mean_value = to_number(cells[4])
        sd_value = to_number(cells[5])
        median_value = to_number(cells[6])
        h_value = to_number(cells[7]) if len(cells) > 7 else None
        p_value = to_number(cells[8]) if len(cells) > 8 else None
        add_record(
            component=component,
            medium=medium,
            water_body=water_body,
            point=point,
            parameter=parameter,
            year=year,
            period=str(year) if year else ("2019-2023" if water_body == "Río Paraguay" and grouping == "point" else "Consolidado"),
            campaign="Resumen estadístico",
            n=n_value,
            mean=mean_value,
            sd=sd_value,
            median=median_value,
            value=None,
            category=variable,
            value_kind=value_kind,
            source=source_ref(path, sheet, int(idx) + 1),
        )
        if h_value is not None or p_value is not None:
            statistical_tests.append(
                {
                    "component": component,
                    "medium": medium,
                    "water_body": water_body,
                    "parameter": parameter,
                    "parameter_key": slug(parameter),
                    "grouping": grouping,
                    "group": group_value,
                    "test": "Kruskal-Wallis",
                    "h": h_value,
                    "p_value": p_value,
                    "significant": bool(p_value is not None and p_value < 0.05),
                    "alpha": 0.05,
                    "n": n_value,
                    "mean": mean_value,
                    "sd": sd_value,
                    "median": median_value,
                    "source": source_ref(path, sheet, int(idx) + 1),
                }
            )


def parse_forestal_surface_summary() -> None:
    path = find_file("Medidas resumen corregido.xls")
    sheet = "Sheet1"
    df = pd.read_excel(path, sheet_name=sheet, header=None, dtype=object)
    for idx, row in df.iterrows():
        cells = [clean_text(value) for value in row.tolist()]
        if not cells or not cells[0] or cells[0].lower() in {"columna1", "medidas", "arroyo"}:
            continue
        water_body = normalize_label(cells[0])
        year_idx = None
        for pos, cell in enumerate(cells[1:], start=1):
            year = to_year(cell)
            if year:
                year_idx = pos
                break
        if year_idx is None:
            continue
        parameter = normalize_label(" ".join(c for c in cells[1:year_idx] if c))
        if not parameter:
            continue
        values = cells[year_idx + 1 :]
        add_record(
            component="Forestal",
            medium="Agua superficial",
            water_body=water_body,
            point=f"{water_body} consolidado",
            parameter=parameter,
            year=to_year(cells[year_idx]),
            period=str(to_year(cells[year_idx])),
            campaign="Resumen anual",
            n=to_number(values[0]) if len(values) > 0 else None,
            mean=to_number(values[1]) if len(values) > 1 else None,
            sd=to_number(values[2]) if len(values) > 2 else None,
            median=to_number(values[3]) if len(values) > 3 else None,
            value=None,
            category="Resumen por arroyo",
            value_kind="summary_by_year",
            source=source_ref(path, sheet, int(idx) + 1),
        )


def parse_groundwater_forestal_long() -> None:
    path = find_file("Resultados en una columna_pozosFOR revisado.xlsx")
    sheet = "Sheet1"
    df = pd.read_excel(path, sheet_name=sheet, dtype=object)
    for idx, row in df.iterrows():
        point = clean_text(row.get("Pozo"))
        parameter = normalize_label(row.get("PARAMETROS"))
        year = to_year(row.get("AÑO"))
        if not point or not parameter or not year:
            continue
        add_record(
            component="Forestal",
            medium="Agua subterránea",
            water_body="Pozos forestales",
            point=point,
            parameter=parameter,
            year=year,
            period=str(year),
            campaign=clean_text(row.get("CAMPAÑA")),
            n=1,
            mean=None,
            sd=None,
            median=None,
            value=to_number(row.get("RESULTADO")),
            category="Dato por campaña",
            value_kind="raw",
            source=source_ref(path, sheet, int(idx) + 2),
        )


def parse_groundwater_industrial_wide() -> None:
    path = find_file("POZOS_INDUSTRIAL.xlsx")
    sheet = "Anexar1"
    df = pd.read_excel(path, sheet_name=sheet, dtype=object)
    campaign_columns = [column for column in df.columns if to_year(column)]
    for idx, row in df.iterrows():
        point = clean_text(row.get("P_MUESTREO"))
        parameter = normalize_label(row.get("PARAMETROS"))
        if not point or not parameter:
            continue
        for column in campaign_columns:
            year = to_year(column)
            value = to_number(row.get(column))
            if year is None or value is None:
                continue
            add_record(
                component="Industrial",
                medium="Agua subterránea",
                water_body="Pozos industriales",
                point=point,
                parameter=parameter,
                year=year,
                period=str(year),
                campaign=clean_text(column),
                n=1,
                mean=None,
                sd=None,
                median=None,
                value=value,
                category="Dato por campaña",
                value_kind="raw",
                source=source_ref(path, sheet, int(idx) + 2),
            )


def series_from_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[tuple, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        key = (
            record["component"],
            record["medium"],
            record["water_body"],
            record["point"],
            record["point_type"],
            record["parameter"],
            record["parameter_key"],
            record.get("year"),
            record.get("period"),
        )
        grouped[key].append(record)

    series: list[dict[str, Any]] = []
    for key, rows in grouped.items():
        (
            component,
            medium,
            water_body,
            point,
            point_type,
            parameter,
            parameter_key,
            year,
            period,
        ) = key
        summary_rows = [row for row in rows if row.get("mean") is not None or row.get("median") is not None]
        raw_values = [row.get("value") for row in rows if row.get("value") is not None]
        if summary_rows and not raw_values:
            row = summary_rows[0]
            count = row.get("n")
            mean_value = row.get("mean")
            sd_value = row.get("sd")
            median_value = row.get("median")
            value = mean_value if mean_value is not None else median_value
            source = row.get("source")
            value_kind = row.get("value_kind")
            point_color = row.get("point_color")
            sheet_tab_color = row.get("sheet_tab_color")
            sheet_tab_color_label = row.get("sheet_tab_color_label")
            point_type_source = row.get("point_type_source")
        else:
            count = len(raw_values)
            mean_value = statistics.fmean(raw_values) if raw_values else None
            sd_value = statistics.stdev(raw_values) if len(raw_values) > 1 else 0 if len(raw_values) == 1 else None
            median_value = statistics.median(raw_values) if raw_values else None
            value = mean_value
            source = rows[0].get("source")
            value_kind = "aggregated_raw"
            point_color = rows[0].get("point_color")
            sheet_tab_color = rows[0].get("sheet_tab_color")
            sheet_tab_color_label = rows[0].get("sheet_tab_color_label")
            point_type_source = rows[0].get("point_type_source")
        series.append(
            {
                "component": component,
                "medium": medium,
                "water_body": water_body,
                "point": point,
                "point_type": point_type,
                "parameter": parameter,
                "parameter_key": parameter_key,
                "year": year,
                "period": period,
                "n": count,
                "mean": mean_value,
                "sd": sd_value,
                "median": median_value,
                "value": value,
                "value_kind": value_kind,
                "point_color": point_color,
                "sheet_tab_color": sheet_tab_color,
                "sheet_tab_color_label": sheet_tab_color_label,
                "point_type_source": point_type_source,
                "source": source,
            }
        )

    comparable_index: dict[tuple, dict[int, float]] = defaultdict(dict)
    consolidated_comparable: dict[tuple, list[int]] = defaultdict(list)
    for row in series:
        if isinstance(row.get("year"), int) and row.get("n") is not None:
            key = (
                row["component"],
                row["medium"],
                row["water_body"],
                row["point"],
                row["parameter_key"],
            )
            comparable_index[key][row["year"]] = max(float(row.get("n") or 0), comparable_index[key].get(row["year"], 0))
        elif row.get("n") is not None and float(row.get("n") or 0) >= 2:
            key = (
                row["component"],
                row["medium"],
                row["water_body"],
                row["point"],
                row["parameter_key"],
            )
            period_years = years_from_period(row.get("period"))
            if len(period_years) >= 2:
                consolidated_comparable[key] = sorted(set(consolidated_comparable[key]) | set(period_years))

    baseline_2021_values: dict[tuple, float] = {}
    baseline_2023_values: dict[tuple, float] = {}
    for row in series:
        key = (
            row["component"],
            row["medium"],
            row["water_body"],
            row["point"],
            row["parameter_key"],
        )
        if row.get("year") == 2021 and row.get("value") is not None:
            baseline_2021_values[key] = row["value"]
        if row.get("year") == 2023 and row.get("value") is not None:
            baseline_2023_values[key] = row["value"]
    for row in series:
        key = (
            row["component"],
            row["medium"],
            row["water_body"],
            row["point"],
            row["parameter_key"],
        )
        year_counts = comparable_index.get(key, {})
        comparable_years = sorted(year for year, count in year_counts.items() if count >= 2)
        consolidated_years = consolidated_comparable.get(key, [])
        row["years_available"] = sorted(year_counts)
        row["period_years"] = years_from_period(row.get("period"))
        row["comparable"] = len(comparable_years) >= 2 or len(consolidated_years) >= 2
        row["comparable_years"] = comparable_years or consolidated_years
        row["baseline_year"] = 2021 if 2021 in year_counts else (min(year_counts) if year_counts else None)
        baseline_2021 = baseline_2021_values.get(key)
        baseline_2023 = baseline_2023_values.get(key)
        baseline = baseline_2021 if baseline_2021 is not None else baseline_2023
        row["baseline_value"] = baseline
        row["baseline_2021_value"] = baseline_2021
        row["baseline_2023_value"] = baseline_2023
        if baseline_2021 is not None and row.get("value") is not None:
            row["delta_vs_2021"] = row["value"] - baseline_2021
            row["delta_pct_vs_2021"] = None if baseline_2021 == 0 else (row["value"] - baseline_2021) / abs(baseline_2021)
        else:
            row["delta_vs_2021"] = None
            row["delta_pct_vs_2021"] = None
        if baseline_2023 is not None and row.get("value") is not None:
            row["delta_vs_2023"] = row["value"] - baseline_2023
            row["delta_pct_vs_2023"] = None if baseline_2023 == 0 else (row["value"] - baseline_2023) / abs(baseline_2023)
        else:
            row["delta_vs_2023"] = None
            row["delta_pct_vs_2023"] = None
        if baseline is not None and row.get("value") is not None:
            row["delta_vs_baseline"] = row["value"] - baseline
            row["delta_pct_vs_baseline"] = None if baseline == 0 else (row["value"] - baseline) / abs(baseline)
            sd = row.get("sd")
            row["deviation_score"] = None if not sd else (row["value"] - baseline) / sd
        else:
            row["delta_vs_baseline"] = None
            row["delta_pct_vs_baseline"] = None
            row["deviation_score"] = None
        row["approaches"] = approach_tags(row)
        row["representativeness_note"] = representativeness_note(row.get("n"), row.get("comparable"))
        row["small_sample_test_note"] = small_sample_test_note(row.get("n"))
    return sorted(series, key=lambda r: (r["component"], r["medium"], r["water_body"], r["point"], r["parameter"], str(r["year"])))


def catalogs(series: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    points: dict[str, dict[str, Any]] = {}
    params: dict[str, dict[str, Any]] = {}
    for row in series:
        point_key = "|".join([row["component"], row["medium"], row["water_body"], row["point"]])
        point = points.setdefault(
            point_key,
            {
                "component": row["component"],
                "medium": row["medium"],
                "water_body": row["water_body"],
                "point": row["point"],
                "point_type": row["point_type"],
                "point_color": row.get("point_color"),
                "sheet_tab_color": row.get("sheet_tab_color"),
                "sheet_tab_color_label": row.get("sheet_tab_color_label"),
                "point_type_source": row.get("point_type_source"),
                "years": set(),
                "parameters": set(),
                "approaches": set(),
                "comparable_records": 0,
            },
        )
        if isinstance(row.get("year"), int):
            point["years"].add(row["year"])
        point["parameters"].add(row["parameter"])
        point["approaches"].update(row.get("approaches", []))
        if row.get("comparable"):
            point["comparable_records"] += 1

        param = params.setdefault(
            row["parameter_key"],
            {"parameter": row["parameter"], "parameter_key": row["parameter_key"], "records": 0, "points": set(), "years": set()},
        )
        param["records"] += 1
        param["points"].add(row["point"])
        if isinstance(row.get("year"), int):
            param["years"].add(row["year"])

    point_catalog = []
    for point in points.values():
        point_catalog.append(
            {
                **{k: v for k, v in point.items() if k not in {"years", "parameters"}},
                "approaches": sorted(point["approaches"]),
                "years": sorted(point["years"]),
                "parameters_count": len(point["parameters"]),
                "comparable": point["comparable_records"] > 0,
            }
        )
    parameter_catalog = []
    for param in params.values():
        parameter_catalog.append(
            {
                **{k: v for k, v in param.items() if k not in {"points", "years"}},
                "points_count": len(param["points"]),
                "years": sorted(param["years"]),
            }
        )
    return sorted(point_catalog, key=lambda x: (x["component"], x["medium"], x["water_body"], x["point"])), sorted(
        parameter_catalog, key=lambda x: strip_accents(x["parameter"]).lower()
    )


def methodology_notes() -> list[dict[str, str]]:
    return [
        {
            "title": "Comparabilidad de puntos",
            "text": "El tablero marca como comparable una serie punto-parametro cuando existen al menos dos anios con n>=2. Esto sigue el criterio del informe: con valores aislados no corresponde inferencia estadistica robusta.",
        },
        {
            "title": "Muestras pequenas",
            "text": "Para n pequeno o distribuciones no normales se prioriza Kruskal-Wallis/Mann-Whitney o pruebas por permutacion. ANOVA se reserva para grupos con normalidad compatible segun Shapiro-Wilk.",
        },
        {
            "title": "Lineas de base",
            "text": "El tablero usa 2021 como linea de base cuando existe; para Rio Paraguay conserva tambien el periodo 2019-2023 reportado por consultoria.",
        },
        {
            "title": "Entrada, medio y salida",
            "text": "La primera clasificacion operativa para Rio Paraguay es FW01-PY=Entrada, FW02-PY=Medio y FW03-PY=Salida. La clasificacion queda visible y editable en la capa de datos.",
        },
        {
            "title": "Colores de pestana",
            "text": "El modelo de datos soporta la regla de colores definida para el proyecto: rojo=entrada, verde=salida y amarillo=intermedio. En los anexos locales no se preservaron colores de pestana, por lo que Rio Paraguay queda clasificado con la regla operativa equivalente.",
        },
        {
            "title": "Parametros monitoreados",
            "text": "El programa parte de 29 parametros iniciales y actualmente ronda 35 parametros monitoreados. La app conserva mas nombres normalizados porque integra anexos de distintos medios y pruebas estadisticas.",
        },
        {
            "title": "Linea de base 2021 y 2023",
            "text": "La app calcula referencias frente a 2021 y tambien frente a 2023 cuando existen datos del mismo punto y parametro, para revisar cambios historicos y situacion reciente.",
        },
    ]


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    APP_DIR.mkdir(exist_ok=True)
    parse_rio_paraguay_point_summary()
    parse_repeated_stat_table(
        "Resultados Kruskall Wallis.xlsx",
        component="Industrial",
        medium="Agua superficial",
        water_body="Río Paraguay",
        grouping="point",
        value_kind="stat_summary_by_point",
    )
    parse_repeated_stat_table(
        "Kruskal Wallis_AÑOS_FISICOQUIMICOS.xlsx",
        component="Industrial",
        medium="Agua superficial",
        water_body="Río Paraguay",
        grouping="year",
        value_kind="stat_summary_by_year",
    )
    parse_forestal_surface_summary()
    parse_repeated_stat_table(
        "Kruskal Wallis.xlsx",
        component="Forestal",
        medium="Agua superficial",
        water_body="Arroyos forestales",
        grouping="year",
        value_kind="stat_summary_by_year",
    )
    parse_groundwater_forestal_long()
    parse_groundwater_industrial_wide()

    series = series_from_records(raw_records)
    point_catalog, parameter_catalog = catalogs(series)
    dataset = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "title": "Monitoreo de Agua PARACEL",
        "methodology": methodology_notes(),
        "summary": {
            "raw_records": len(raw_records),
            "series_records": len(series),
            "statistical_tests": len(statistical_tests),
            "points": len(point_catalog),
            "parameters": len(parameter_catalog),
            "years": sorted({row["year"] for row in series if isinstance(row.get("year"), int)}),
        },
        "filters": {
            "approaches": [
                "Enfoque 1 · Por Campaña",
                "Enfoque 2 · En el Tiempo",
                "Enfoque 3 · Evolución del Programa",
            ],
            "flow_types": ["Entrada", "Medio", "Salida", "Pozo", "No clasificado", "Sin clasificar"],
        },
        "rio_paraguay_sources": RIO_PARAGUAY_SOURCES,
        "point_catalog": point_catalog,
        "parameter_catalog": parameter_catalog,
        "series": series,
        "raw_records": raw_records,
        "statistical_tests": statistical_tests,
    }
    json_text = json.dumps(dataset, ensure_ascii=False, indent=2)
    (DATA_DIR / "monitoring_dataset.json").write_text(json_text, encoding="utf-8")
    app_payload = {key: value for key, value in dataset.items() if key != "raw_records"}
    app_payload["raw_records_available_in"] = "data/monitoring_dataset.json"
    (APP_DIR / "monitoring_dataset.js").write_text(
        "window.MONITORING_DATA = " + json.dumps(app_payload, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    print(json.dumps(dataset["summary"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
