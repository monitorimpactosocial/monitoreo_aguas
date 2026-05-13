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
    "Canal": {
        "point_color": "#4B9C8E",
        "sheet_tab_color": "#4B9C8E",
        "sheet_tab_color_label": "turquesa",
        "point_type_source": "clasificacion operativa: CH=canal de drenaje",
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

MONTH_NAMES = {
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
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
        "role": "ANOVA por años para DBO, DQO y pH",
        "file": "Anexos\\Agua superficial\\Industrial\\ANOVA_AÑOS_DQO-DBO-pH.xlsx",
        "sheet": "Sheet1",
    },
    {
        "role": "Normalidad Shapiro-Wilk",
        "file": "Anexos\\Agua superficial\\Industrial\\SHAPIRO_FW_RIOPY.xlsx",
        "sheet": "Sheet1",
    },
    {
        "role": "Kruskal-Wallis de coliformes entre puntos",
        "file": "Anexos\\Agua superficial\\Industrial\\Kruskal Wallis coliformes.xlsx",
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
    comparable_key = re.sub(r"[^a-z0-9]+", " ", strip_accents(text).lower()).strip()
    canonical = {
        "2 4 d": "2,4-D",
        "clorofila a": "Clorofila A",
        "col fec": "Coliformes fecales",
        "col tot": "Coliformes totales",
        "fosforo total": "Fósforo total",
        "niquel": "Níquel",
        "tiametoxan": "Tiametoxam",
        "demanda biologica de oxigeno": "Demanda biológica de oxígeno",
        "demanda quimica de oxigeno": "Demanda química de oxígeno",
        "ortosfato fosfato": "Ortofosfatos",
        "ortofosfatos": "Ortofosfatos",
        "conductividad electrica": "Conductividad eléctrica",
        "solidos disueltos totales": "Sólidos disueltos totales",
        "oxigeno disuelto": "Oxígeno disuelto",
        "nitrogeno total": "Nitrógeno total",
        "amoniaco": "Amoniaco",
    }
    if comparable_key in canonical:
        return canonical[comparable_key]
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


def campaign_meta(value: Any) -> tuple[int | None, int | None, str, str | None]:
    text = clean_text(value)
    match = re.search(r"C\s*(\d{1,2})\s*[_-]\s*(20\d{2})", text, re.IGNORECASE)
    if not match:
        return None, None, text, None
    month = int(match.group(1))
    year = int(match.group(2))
    if not 1 <= month <= 12:
        return year, None, text, None
    month_label = MONTH_NAMES[month]
    return year, month, f"{year}-{month:02d}", f"{month_label} {year}"


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
    if normalized.startswith("CH"):
        return "Canal"
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


def component_code(component: str) -> str:
    normalized = strip_accents(component).lower()
    if "industrial" in normalized:
        return "IND"
    if "forestal" in normalized:
        return "FOR"
    return slug(component).upper()


def medium_code(medium: str, point: str = "") -> str:
    normalized_medium = strip_accents(medium).lower()
    normalized_point = strip_accents(point).upper().replace(" ", "")
    if normalized_point.startswith("CH") or "canal" in normalized_medium:
        return "CH"
    if "subterr" in normalized_medium or normalized_point.startswith("GW"):
        return "GW"
    if "superficial" in normalized_medium or normalized_point.startswith("FW"):
        return "FW"
    return slug(medium).upper()


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
    component = normalize_label(kwargs.get("component", ""))
    medium = normalize_label(kwargs.get("medium", ""))
    kwargs["component"] = component
    kwargs["medium"] = medium
    kwargs["point"] = point
    kwargs["parameter"] = parameter
    kwargs["parameter_key"] = slug(parameter)
    kwargs["water_body"] = water_body
    kwargs["point_type"] = kwargs.get("point_type") or classify_point(point, water_body)
    kwargs["component_code"] = kwargs.get("component_code") or component_code(component)
    kwargs["medium_code"] = kwargs.get("medium_code") or medium_code(medium, point)
    kwargs.update({k: kwargs.get(k, v) for k, v in point_type_meta(kwargs["point_type"]).items()})
    raw_records.append(kwargs)


def parse_rio_paraguay_point_summary() -> None:
    path = find_file("REsultados compilados Rio PAraguay_ todos los parametros.xlsx")
    sheet = "Comparación puntos_muestreo"
    df = pd.read_excel(path, sheet_name=sheet, header=0, dtype=object)
    df.columns = [clean_text(column) for column in df.columns]
    param_col = next((column for column in df.columns if slug(column) == "parametros"), None)
    point_col = next((column for column in df.columns if "puntos" in slug(column)), None)
    n_col = next((column for column in df.columns if slug(column) == "n"), None)
    mean_col = next((column for column in df.columns if slug(column) == "promedio"), None)
    sd_col = next((column for column in df.columns if "desviacion" in slug(column)), None)
    median_col = next((column for column in df.columns if "mediana" in slug(column)), None)
    if not param_col or not point_col:
        raise ValueError("No se encontraron columnas de parametros/puntos para Rio Paraguay")
    current_param = ""
    current_category = ""
    for idx, row in df.iterrows():
        param_cell = normalize_label(row.get(param_col, ""))
        point = clean_text(row.get(point_col, ""))
        if param_cell and not point.upper().startswith("FW"):
            current_category = param_cell
            current_param = ""
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
            n=to_number(row.get(n_col)) if n_col else None,
            mean=to_number(row.get(mean_col)) if mean_col else None,
            sd=to_number(row.get(sd_col)) if sd_col else None,
            median=to_number(row.get(median_col)) if median_col else None,
            value=None,
            category=current_category,
            value_kind="summary_by_point",
            source=source_ref(path, sheet, int(idx) + 2),
        )


def parse_rio_paraguay_campaign_summary(filename: str, parameter: str) -> None:
    path = find_file(filename)
    sheet = pd.ExcelFile(path).sheet_names[0]
    df = pd.read_excel(path, sheet_name=sheet, dtype=object)
    campaign_col = next((column for column in df.columns if "campana" in slug(column) or "campaña" in clean_text(column).lower()), df.columns[0])
    mean_col = next((column for column in df.columns if slug(column) == "medias"), None)
    n_col = next((column for column in df.columns if slug(column) == "n"), None)
    se_col = next((column for column in df.columns if slug(column) in {"e_e", "ee"}), None)
    if not mean_col:
        return
    for idx, row in df.iterrows():
        campaign = clean_text(row.get(campaign_col))
        year, month, period, period_label = campaign_meta(campaign)
        if not year or not month:
            continue
        add_record(
            component="Industrial",
            medium="Agua superficial",
            water_body="Río Paraguay",
            point="Río Paraguay mensual",
            parameter=parameter,
            year=year,
            month=month,
            month_label=period_label,
            period=period,
            period_sort=year * 100 + month,
            campaign=campaign,
            n=to_number(row.get(n_col)) if n_col else None,
            mean=to_number(row.get(mean_col)),
            sd=None,
            se=to_number(row.get(se_col)) if se_col else None,
            median=None,
            value=None,
            category="Resumen mensual por campaña",
            value_kind="monthly_campaign_summary",
            source=source_ref(path, sheet, int(idx) + 2),
        )


def parse_rio_paraguay_pesticides_detected() -> None:
    path = find_file("Pesticidas detectados.xlsx")
    sheet = pd.ExcelFile(path).sheet_names[0]
    df = pd.read_excel(path, sheet_name=sheet, dtype=object)
    point_col = next((column for column in df.columns if "punto" in slug(column)), None)
    campaign_col = next((column for column in df.columns if "campana" in slug(column)), None)
    if not point_col or not campaign_col:
        return
    parameter_cols = [
        column
        for column in df.columns
        if not str(column).startswith("Unnamed") and column not in {point_col, campaign_col}
    ]
    for idx, row in df.iterrows():
        point = clean_text(row.get(point_col))
        campaign = clean_text(row.get(campaign_col))
        year, month, period, period_label = campaign_meta(campaign)
        if not point.upper().startswith("FW") or not year or not month:
            continue
        for column in parameter_cols:
            value = to_number(row.get(column))
            if value is None:
                continue
            add_record(
                component="Industrial",
                medium="Agua superficial",
                water_body="Río Paraguay",
                point=point,
                parameter=clean_text(column),
                year=year,
                month=month,
                month_label=period_label,
                period=period,
                period_sort=year * 100 + month,
                campaign=campaign,
                n=1,
                mean=None,
                sd=None,
                median=None,
                value=value,
                category="Agroquímicos detectados por campaña",
                value_kind="raw_monthly",
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
                    "statistic_label": "H",
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


def append_statistical_test(
    *,
    component: str,
    medium: str,
    water_body: str,
    parameter: str,
    grouping: str,
    group: str,
    test: str,
    statistic_value: float | None,
    statistic_label: str,
    p_value: float | None,
    n_value: float | None,
    mean_value: float | None,
    sd_value: float | None,
    median_value: float | None,
    source: dict[str, Any],
) -> None:
    statistical_tests.append(
        {
            "component": component,
            "medium": medium,
            "water_body": water_body,
            "parameter": parameter,
            "parameter_key": slug(parameter),
            "grouping": grouping,
            "group": group,
            "test": test,
            "h": statistic_value,
            "statistic_label": statistic_label,
            "p_value": p_value,
            "significant": bool(p_value is not None and p_value < 0.05),
            "alpha": 0.05,
            "n": n_value,
            "mean": mean_value,
            "sd": sd_value,
            "median": median_value,
            "source": source,
        }
    )


def parse_shapiro_normality(
    filename: str,
    *,
    component: str,
    medium: str,
    water_body: str,
) -> None:
    path = find_file(filename)
    sheet = pd.ExcelFile(path).sheet_names[0]
    df = pd.read_excel(path, sheet_name=sheet, header=None, dtype=object)
    for idx, row in df.iterrows():
        cells = [clean_text(value) for value in row.tolist()]
        if len(cells) < 7:
            continue
        parameter = normalize_label(cells[0])
        if not parameter or slug(parameter) in {"parametro", "columna1"}:
            continue
        n_value = to_number(cells[2])
        mean_value = to_number(cells[3])
        sd_value = to_number(cells[4])
        w_value = to_number(cells[5])
        p_value = to_number(cells[6])
        if n_value is None and w_value is None and p_value is None:
            continue
        append_statistical_test(
            component=component,
            medium=medium,
            water_body=water_body,
            parameter=parameter,
            grouping="normality",
            group=water_body,
            test="Shapiro-Wilk",
            statistic_value=w_value,
            statistic_label="W",
            p_value=p_value,
            n_value=n_value,
            mean_value=mean_value,
            sd_value=sd_value,
            median_value=None,
            source=source_ref(path, sheet, int(idx) + 1),
        )


def parse_two_column_kruskal_table(
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
        group_value = clean_text(cells[1])
        if not parameter or slug(parameter) in {"variable", "prueba", "trat", "medias", "columna1"}:
            continue
        if not group_value or slug(group_value) in {"punto", "campana", "ranks"}:
            continue

        year = to_year(group_value)
        if grouping == "point" and not re.search(r"[A-Za-z]{1,4}\d", group_value):
            continue
        if grouping == "campaign" and year is None:
            continue
        if grouping == "campaign":
            point = f"{water_body} mensual"
            period = str(year) if year else group_value
            campaign = f"Campaña {group_value}"
        else:
            point = group_value
            period = "2019-2023" if water_body == "Río Paraguay" else "Consolidado"
            campaign = "Resumen estadístico"

        n_value = to_number(cells[2])
        mean_value = to_number(cells[3])
        sd_value = to_number(cells[4])
        median_value = to_number(cells[5])
        h_value = to_number(cells[6])
        p_value = to_number(cells[7])
        src = source_ref(path, sheet, int(idx) + 1)
        add_record(
            component=component,
            medium=medium,
            water_body=water_body,
            point=point,
            parameter=parameter,
            year=year,
            period=period,
            campaign=campaign,
            n=n_value,
            mean=mean_value,
            sd=sd_value,
            median=median_value,
            value=None,
            category="Resultado estadístico complementario",
            value_kind=value_kind,
            source=src,
        )
        if h_value is not None or p_value is not None:
            append_statistical_test(
                component=component,
                medium=medium,
                water_body=water_body,
                parameter=parameter,
                grouping=grouping,
                group=group_value,
                test="Kruskal-Wallis",
                statistic_value=h_value,
                statistic_label="H",
                p_value=p_value,
                n_value=n_value,
                mean_value=mean_value,
                sd_value=sd_value,
                median_value=median_value,
                source=src,
            )


def parse_rio_paraguay_anova_years() -> None:
    path = find_file("ANOVA_AÑOS_DQO-DBO-pH.xlsx")
    sheet = pd.ExcelFile(path).sheet_names[0]
    df = pd.read_excel(path, sheet_name=sheet, header=None, dtype=object)
    current_parameter = ""
    for idx, row in df.iterrows():
        cells = [clean_text(value) for value in row.tolist()]
        if len(cells) < 6:
            continue
        first = clean_text(cells[0])
        second = clean_text(cells[1])
        if second.lower() == "resultado" and to_number(cells[2]) is not None:
            current_parameter = normalize_label(first)
            continue
        if strip_accents(first).upper() not in {"ANO", "ANIO", "AÑO"} or not current_parameter:
            continue
        f_value = to_number(cells[4])
        p_value = to_number(cells[5])
        if f_value is None and p_value is None:
            continue
        append_statistical_test(
            component="Industrial",
            medium="Agua superficial",
            water_body="Río Paraguay",
            parameter=current_parameter,
            grouping="year",
            group="AÑO",
            test="ANOVA",
            statistic_value=f_value,
            statistic_label="F",
            p_value=p_value,
            n_value=None,
            mean_value=None,
            sd_value=None,
            median_value=None,
            source=source_ref(path, sheet, int(idx) + 1),
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
        summary_rows = [
            row
            for row in rows
            if row.get("mean") is not None
            or row.get("median") is not None
            or (row.get("n") is not None and "summary" in clean_text(row.get("value_kind")).lower())
        ]
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
            component_code_value = row.get("component_code")
            medium_code_value = row.get("medium_code")
            campaign = row.get("campaign")
            month = row.get("month")
            month_label = row.get("month_label")
            period_sort = row.get("period_sort")
            category = row.get("category")
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
            component_code_value = rows[0].get("component_code")
            medium_code_value = rows[0].get("medium_code")
            campaign = rows[0].get("campaign")
            month = rows[0].get("month")
            month_label = rows[0].get("month_label")
            period_sort = rows[0].get("period_sort")
            category = rows[0].get("category")
        series.append(
            {
                "component": component,
                "component_code": component_code_value,
                "medium": medium,
                "medium_code": medium_code_value,
                "water_body": water_body,
                "point": point,
                "point_type": point_type,
                "parameter": parameter,
                "parameter_key": parameter_key,
                "year": year,
                "month": month,
                "month_label": month_label,
                "period": period,
                "period_sort": period_sort,
                "campaign": campaign,
                "n": count,
                "mean": mean_value,
                "sd": sd_value,
                "median": median_value,
                "value": value,
                "value_kind": value_kind,
                "category": category,
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
                "component_code": row.get("component_code"),
                "medium": row["medium"],
                "medium_code": row.get("medium_code"),
                "water_body": row["water_body"],
                "point": row["point"],
                "point_type": row["point_type"],
                "point_color": row.get("point_color"),
                "sheet_tab_color": row.get("sheet_tab_color"),
                "sheet_tab_color_label": row.get("sheet_tab_color_label"),
                "point_type_source": row.get("point_type_source"),
                "years": set(),
                "months": set(),
                "parameters": set(),
                "approaches": set(),
                "comparable_records": 0,
            },
        )
        if isinstance(row.get("year"), int):
            point["years"].add(row["year"])
        if isinstance(row.get("month"), int) and isinstance(row.get("year"), int):
            point["months"].add(f"{row['year']}-{row['month']:02d}")
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
                "months": sorted(point["months"]),
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
    parse_rio_paraguay_campaign_summary("pH Test.Tukey.Alfa.0.05.DMS.0.56075.xlsx", "pH")
    parse_rio_paraguay_campaign_summary("DBO5 Test.Tukey.Alfa.0.05.DMS.1.36846.xlsx", "DBO5")
    parse_rio_paraguay_campaign_summary("DQO Test.Tukey.Alfa.0.05.DMS.39.36231.xlsx", "DQO")
    parse_rio_paraguay_pesticides_detected()
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
    parse_rio_paraguay_anova_years()
    parse_shapiro_normality(
        "SHAPIRO_FW_RIOPY.xlsx",
        component="Industrial",
        medium="Agua superficial",
        water_body="Río Paraguay",
    )
    parse_two_column_kruskal_table(
        "Kruskal Wallis coliformes.xlsx",
        component="Industrial",
        medium="Agua superficial",
        water_body="Río Paraguay",
        grouping="point",
        value_kind="stat_summary_by_point",
    )
    parse_two_column_kruskal_table(
        "KruskalWallis_PesticidasRioPY_entre campañas.xlsx",
        component="Industrial",
        medium="Agua superficial",
        water_body="Río Paraguay",
        grouping="campaign",
        value_kind="stat_summary_by_campaign",
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
            "flow_types": ["Entrada", "Medio", "Salida", "Pozo", "Canal", "No clasificado", "Sin clasificar"],
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
