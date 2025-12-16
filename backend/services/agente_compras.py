import json
from pathlib import Path
from datetime import datetime
import uuid

DATA_PATH = Path(__file__).parent.parent / "data"
COMPRAS_PATH = DATA_PATH / "compras_activas.json"
PRODUCTOS_PATH = DATA_PATH / "productos.json"
CANASTONES_PATH = DATA_PATH / "canastones_guardados.json"

# ---------- utilidades ----------
def leer_json(path, default):
    if not path.exists():
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def guardar_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def cargar_catalogo():
    productos = leer_json(PRODUCTOS_PATH, {})
    return [p for cat in productos.values() for p in cat]


# ---------- agente ----------
def iniciar_compra(canaston: dict):
    compras = leer_json(COMPRAS_PATH, [])

    monto_inicial = canaston["total_gastado"] + canaston["saldo_restante"]

    compra = {
        "id": str(uuid.uuid4()),
        "fecha_inicio": datetime.now().isoformat(),
        "monto_inicial": monto_inicial,
        "monto_restante": monto_inicial,
        "canaston_actual": canaston,
        "comprados": []
    }

    compras.append(compra)
    guardar_json(COMPRAS_PATH, compras)

    return compra


def comprar_item(compra_id: str, item: dict):
    compras = leer_json(COMPRAS_PATH, [])
    compra = next((c for c in compras if c["id"] == compra_id), None)

    if not compra:
        return { "error": "Compra no encontrada" }

    precio = item["precio"]

    if precio > compra["monto_restante"]:
        return { "error": "Saldo insuficiente" }

    # Registrar compra
    compra["comprados"].append(item)
    compra["monto_restante"] -= precio

    # Recalcular canastón
    catalogo = cargar_catalogo()
    restantes = [
        p for p in catalogo
        if p["precio"] <= compra["monto_restante"]
    ]

    compra["canaston_actual"] = {
        "productos": restantes,
        "total_gastado": sum(p["precio"] for p in compra["comprados"]),
        "saldo_restante": round(compra["monto_restante"], 2)
    }

    guardar_json(COMPRAS_PATH, compras)

    return compra


def finalizar_compra(compra_id: str):
    compras = leer_json(COMPRAS_PATH, [])
    compra = next((c for c in compras if c["id"] == compra_id), None)

    if not compra:
        return { "error": "Compra no encontrada" }

    compras = [c for c in compras if c["id"] != compra_id]
    guardar_json(COMPRAS_PATH, compras)

    return {
        "mensaje": "Compra finalizada",
        "fecha_fin": datetime.now().isoformat(),
        "comprados": compra["comprados"],
        "total_gastado": sum(p["precio"] for p in compra["comprados"])
    }

# añadido por Mairon
def obtener_ultimo_canaston_por_fecha():
    try:
        if not CANASTONES_PATH.exists():
            return None
        
        with open(CANASTONES_PATH, "r", encoding="utf-8") as f:
            canastones = json.load(f)
        
        if not canastones:
            return None
        
        canastones_con_fecha = [
            c for c in canastones 
            if "fecha_creacion" in c or "fecha" in c
        ]
        
        if not canastones_con_fecha:
            return canastones[-1]
        
        canastones_con_fecha.sort(
            key=lambda x: x.get("fecha_creacion") or x.get("fecha"),
            reverse=True
        )
        
        print(f"Último canastón por fecha: {canastones_con_fecha[0].get('fecha_creacion', 'sin fecha')}")
        return canastones_con_fecha[0]
        
    except Exception as e:
        print(f"Error: {e}")
        return None

# ejemplo de uso 

# POST /iniciar_compra
# y recibiras una compra_id #######IMPORTANTE
# con eso puedes seguir interactuando con esa compra actual

# ej para compra

# POST /comprar_item/{compra_id}
# mandando este json 
# {
#   "nombre": "Tomate (kg)",
#   "precio": 7
# }
# y para finalizar 
# POST /finalizar_compra/{compra_id}


