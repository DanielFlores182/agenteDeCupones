import json
from pathlib import Path
from datetime import datetime

DATA_PATH = Path(__file__).parent.parent / "data"
FINALIZADAS_PATH = DATA_PATH / "compras_finalizadas.json"


def leer_json(path, default):
    if not path.exists():
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def generar_reporte(compra: dict, monto_inicial: float):
    productos = compra.get("comprados", [])
    total_gastado = sum(p["precio"] for p in productos)

    diferencia = round(monto_inicial - total_gastado, 2)

    if diferencia >= 0:
        estado = "sobrante"
        monto_sobrante = diferencia
        monto_faltante = 0
    else:
        estado = "faltante"
        monto_sobrante = 0
        monto_faltante = abs(diferencia)

    reporte = {
        "fecha_reporte": datetime.now().isoformat(),
        "productos_comprados": productos,
        "total_gastado": total_gastado,
        "monto_cupon": monto_inicial,
        "estado": estado,
        "monto_sobrante": monto_sobrante,
        "monto_faltante": monto_faltante
    }

    # Guardar reporte
    historial = leer_json(FINALIZADAS_PATH, [])
    historial.append(reporte)

    with open(FINALIZADAS_PATH, "w", encoding="utf-8") as f:
        json.dump(historial, f, indent=2, ensure_ascii=False)

    return reporte


def obtener_reportes():
    return leer_json(FINALIZADAS_PATH, [])

##########ejemplo entrada 
# {
#   "compra": {
#     "comprados": [
#       { "nombre": "Papa (kg)", "precio": 6 },
#       { "nombre": "Tomate (kg)", "precio": 7 }
#     ]
#   },
#   "monto_inicial": 20
# }
######## ejemplo salida
########sobrando dinero

# {
#   "estado": "sobrante",
#   "total_gastado": 13,
#   "monto_cupon": 20,
#   "monto_sobrante": 7,
#   "monto_faltante": 0,
#   "productos_comprados": [...]
# }
############ejemplo salida
############faltando dinero
# {
#   "estado": "faltante",
#   "total_gastado": 25,
#   "monto_cupon": 20,
#   "monto_sobrante": 0,
#   "monto_faltante": 5,
#   "productos_comprados": [...]
# }
