from __future__ import annotations

import json
import re
import zipfile
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree as ET

import pandas as pd
from pyproj import Transformer


ROOT = Path(__file__).resolve().parents[1]
APP_MAP = ROOT / "app" / "gis_map.js"
SOURCE_DIR = Path(
    r"C:\Users\DiegoMeza\OneDrive - PARACEL S.A\MONITOREO_IMPACTO_SOCIAL_PARACEL\MONITOREO_AGUAS"
)
KMZ_SOURCES = [
    SOURCE_DIR / "1 GW FOR 2024 (1).kmz",
    SOURCE_DIR / "FW FO 2025..kmz",
]
POINTS_WORKBOOK = SOURCE_DIR / "BD_MONITOREO_AGUAS_PARACEL.xlsx"

WGS84_TO_UTM21S = Transformer.from_crs("EPSG:4326", "EPSG:32721", always_xy=True)
UTM21S_TO_WGS84 = Transformer.from_crs("EPSG:32721", "EPSG:4326", always_xy=True)


def normalize_code(value: object) -> str:
    text = str(value or "").upper()
    return re.sub(r"[^A-Z0-9]", "", text)


def read_gis_map() -> dict:
    text = APP_MAP.read_text(encoding="utf-8").strip()
    prefix = "window.PARACEL_GIS_MAP = "
    if not text.startswith(prefix):
        raise ValueError("app/gis_map.js no tiene el prefijo esperado")
    return json.loads(text[len(prefix) :].rstrip(";"))


def write_gis_map(payload: dict) -> None:
    APP_MAP.write_text(
        "window.PARACEL_GIS_MAP = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )


def add_point(
    points: dict,
    priorities: dict,
    *,
    label: str,
    x: float,
    y: float,
    lat: float,
    lng: float,
    source: str,
    priority: int,
    aliases: list[str] | None = None,
) -> None:
    keys = [normalize_code(label), *(aliases or [])]
    keys = [key for key in dict.fromkeys(keys) if key]
    item = {
        "label": label,
        "x": round(float(x), 1),
        "y": round(float(y), 1),
        "lat": round(float(lat), 6),
        "lng": round(float(lng), 6),
        "source": source,
    }
    for key in keys:
        if priority >= priorities.get(key, -1):
            points[key] = item
            priorities[key] = priority


def aliases_for_label(label: str) -> list[str]:
    code = normalize_code(label)
    aliases = [code]
    match = re.match(r"^(GW|FW|CH)0*([0-9]{1,3})(.*)$", code)
    if match:
        prefix, number, suffix = match.groups()
        aliases.append(f"{prefix}{int(number):02d}{suffix}")
        aliases.append(f"{prefix}{int(number)}{suffix}")
        if prefix == "GW":
            replacements = {
                "SANJUAN": "SJ",
                "LAGUNA": "LAG",
                "PALOHAYA": "PALOH",
                "BELEN": "BELEN",
                "MICHEL": "MICHEL",
            }
            for original, short in replacements.items():
                if original in suffix:
                    aliases.append(f"{prefix}{int(number):02d}{short}")
                    aliases.append(f"{prefix}{int(number)}{short}")
    if "317RZ323RZ" in code:
        aliases.extend(["FW317RZ", "FW323RZ"])
    return aliases


def iter_kmz_points(path: Path) -> list[dict]:
    if not path.exists():
        return []
    rows = []
    with zipfile.ZipFile(path) as kmz:
        for member in kmz.namelist():
            if not member.lower().endswith(".kml"):
                continue
            root = ET.fromstring(kmz.read(member))
            ns = {"k": "http://www.opengis.net/kml/2.2"}
            for placemark in root.findall(".//k:Placemark", ns):
                name = placemark.find("k:name", ns)
                coords = placemark.find(".//k:coordinates", ns)
                if name is None or coords is None or not coords.text:
                    continue
                first = coords.text.strip().split()[0]
                parts = first.split(",")
                if len(parts) < 2:
                    continue
                lng = float(parts[0])
                lat = float(parts[1])
                x, y = WGS84_TO_UTM21S.transform(lng, lat)
                rows.append({"label": name.text.strip(), "lng": lng, "lat": lat, "x": x, "y": y})
    return rows


def to_number(value: object) -> float | None:
    text = str(value or "").strip()
    if not text or text.upper() in {"S/D", "SD", "NAN", "—"}:
        return None
    text = text.replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


def read_freshwater_catalog() -> list[dict]:
    if not POINTS_WORKBOOK.exists():
        return []
    df = pd.read_excel(POINTS_WORKBOOK, sheet_name="PUNTOS", header=None, dtype=object)
    header_idx = None
    for idx, row in df.iterrows():
        values = [str(value).strip() for value in row.tolist()]
        if "Punto ID" in values:
            header_idx = idx
            break
    if header_idx is None:
        return []

    headers = [str(value).strip() for value in df.iloc[header_idx].tolist()]
    data = df.iloc[header_idx + 1 :].copy()
    data.columns = headers
    rows = []
    for _, row in data.iterrows():
        point = str(row.get("Punto ID", "")).strip()
        if not point or point.lower() == "nan" or "Leyenda" in point:
            continue
        x = to_number(row.get("Coord X (UTM)"))
        y = to_number(row.get("Coord Y (UTM)"))
        if x is None or y is None:
            continue
        lng, lat = UTM21S_TO_WGS84.transform(x, y)
        rows.append(
            {
                "label": point,
                "subcuenca": str(row.get("Subcuenca", "")).strip(),
                "estado": str(row.get("Estado", "")).strip(),
                "x": x,
                "y": y,
                "lat": lat,
                "lng": lng,
            }
        )
    return rows


def centroid(rows: list[dict]) -> tuple[float, float, float, float] | None:
    valid = [row for row in rows if row.get("x") is not None and row.get("y") is not None]
    if not valid:
        return None
    x = sum(float(row["x"]) for row in valid) / len(valid)
    y = sum(float(row["y"]) for row in valid) / len(valid)
    lng, lat = UTM21S_TO_WGS84.transform(x, y)
    return x, y, lat, lng


def main() -> None:
    payload = read_gis_map()
    points = dict(payload.get("monitoring_points") or {})
    priorities = {key: 0 for key in points}
    source_files = list(payload.get("source_files") or [])

    for path in KMZ_SOURCES:
        if str(path) not in source_files and path.exists():
            source_files.append(str(path))
        for row in iter_kmz_points(path):
            add_point(
                points,
                priorities,
                label=row["label"],
                x=row["x"],
                y=row["y"],
                lat=row["lat"],
                lng=row["lng"],
                source=str(path),
                priority=100,
                aliases=aliases_for_label(row["label"]),
            )

    if POINTS_WORKBOOK.exists() and str(POINTS_WORKBOOK) not in source_files:
        source_files.append(str(POINTS_WORKBOOK))

    fw_rows = read_freshwater_catalog()
    for row in fw_rows:
        add_point(
            points,
            priorities,
            label=row["label"],
            x=row["x"],
            y=row["y"],
            lat=row["lat"],
            lng=row["lng"],
            source=f"{POINTS_WORKBOOK} :: PUNTOS",
            priority=80,
            aliases=aliases_for_label(row["label"]),
        )

    by_subcuenca: dict[str, list[dict]] = {}
    for row in fw_rows:
        by_subcuenca.setdefault(normalize_code(row.get("subcuenca")), []).append(row)

    consolidated = {
        "Arroyos forestales consolidado": [row for row in fw_rows if normalize_code(row.get("subcuenca")) not in {"CONTROL", "HISTORICOPY"}],
        "Hermosa consolidado": by_subcuenca.get("HERMOSA", []),
        "Laguna-Penayo consolidado": [row for row in fw_rows if normalize_code(row["label"]) == "FW316CR"],
        "Machuca consolidado": [],
        "Napegue consolidado": by_subcuenca.get("NAPEGUE", []),
        "Negla consolidado": by_subcuenca.get("NEGLA", []),
        "Pitanohaga consolidado": by_subcuenca.get("PITANOHAGA", []) + [row for row in fw_rows if normalize_code(row["label"]) == "FW210ZM"],
        "Rio-Aquidaban consolidado": by_subcuenca.get("AQUIDABAN", []),
        "Soledad consolidado": by_subcuenca.get("ITASILLA", []),
        "Trementina consolidado": by_subcuenca.get("TREMENTINA", []),
    }

    component_centers = {
        normalize_code(feature.get("code")): feature.get("center")
        for feature in payload.get("features", [])
        if feature.get("layer") == "components" and feature.get("center")
    }
    if component_centers.get("MC"):
        x, y = component_centers["MC"]
        lng, lat = UTM21S_TO_WGS84.transform(x, y)
        add_point(
            points,
            priorities,
            label="Machuca consolidado",
            x=x,
            y=y,
            lat=lat,
            lng=lng,
            source="Centroide componente PARACEL MC",
            priority=70,
            aliases=["MACHUCACONSOLIDADO"],
        )

    for label, rows in consolidated.items():
        result = centroid(rows)
        if not result:
            continue
        x, y, lat, lng = result
        add_point(
            points,
            priorities,
            label=label,
            x=x,
            y=y,
            lat=lat,
            lng=lng,
            source=f"{POINTS_WORKBOOK} :: PUNTOS centroid",
            priority=75,
            aliases=[normalize_code(label)],
        )

    rio_paraguay = points.get("ROPARAGUAYCONSOLIDADO") or points.get("RIOPARAGUAYCONSOLIDADO")
    if rio_paraguay:
        rio_paraguay = {
            **rio_paraguay,
            "label": "Río Paraguay consolidado",
            "source": rio_paraguay.get("source", "Base GIS PARACEL"),
        }
        points["ROPARAGUAYCONSOLIDADO"] = rio_paraguay
        points["RIOPARAGUAYCONSOLIDADO"] = rio_paraguay
        priorities["ROPARAGUAYCONSOLIDADO"] = max(priorities.get("ROPARAGUAYCONSOLIDADO", 0), 60)
        priorities["RIOPARAGUAYCONSOLIDADO"] = max(priorities.get("RIOPARAGUAYCONSOLIDADO", 0), 60)

    payload["generated_at"] = datetime.now().strftime("%Y-%m-%d")
    payload["source_files"] = source_files
    payload["monitoring_points"] = dict(sorted(points.items()))
    payload["monitoring_points_source"] = {
        "kmz": [str(path) for path in KMZ_SOURCES if path.exists()],
        "freshwater_catalog": str(POINTS_WORKBOOK) if POINTS_WORKBOOK.exists() else None,
        "projection": "EPSG:32721",
        "count": len(payload["monitoring_points"]),
    }
    write_gis_map(payload)

    print(
        json.dumps(
            {
                "monitoring_points": len(payload["monitoring_points"]),
                "kmz_points": sum(len(iter_kmz_points(path)) for path in KMZ_SOURCES),
                "freshwater_catalog_points": len(fw_rows),
                "sources": payload["monitoring_points_source"],
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
