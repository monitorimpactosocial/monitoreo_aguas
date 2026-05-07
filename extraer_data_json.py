"""Extrae HISTORICAL_DATA de DataImport.gs y genera data.json para GitHub Pages."""
import re, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SRC = r'c:\tmp\monitoreo_aguas\DataImport.gs'
DST = r'c:\tmp\monitoreo_aguas\data.json'

with open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const HISTORICAL_DATA = (\[.+\]);', content, re.DOTALL)
if not m:
    print("ERROR: no se encontró HISTORICAL_DATA"); sys.exit(1)

data = json.loads(m.group(1))
print(f"Registros: {len(data)}")
print(f"Campos: {list(data[0].keys())[:6]}...")

with open(DST, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

import os
size = os.path.getsize(DST) / 1024
print(f"OK: {DST} ({size:.1f} KB)")
