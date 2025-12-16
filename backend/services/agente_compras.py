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

def canaston_vacio():
    return {
        "productos": [],
        "total_gastado": 0,
        "saldo_restante": 0
    }

# ---------- agente ----------
def iniciar_compra(canaston: dict):
    compras = leer_json(COMPRAS_PATH, [])

    total_gastado = canaston.get("total_gastado", 0)
    saldo_restante = canaston.get("saldo_restante", 0)
    monto_inicial = total_gastado + saldo_restante

    compra = {
        "id": str(uuid.uuid4()),
        "fecha_inicio": datetime.now().isoformat(),
        "monto_inicial": monto_inicial,
        "monto_restante": monto_inicial,
        "canaston_actual": {
            "productos": canaston.get("productos", []),
            "total_gastado": total_gastado,
            "saldo_restante": saldo_restante
        },
        "carrito": []  # Productos seleccionados por el usuario
    }

    compras.append(compra)
    guardar_json(COMPRAS_PATH, compras)

    return compra

def comprar_item(compra_id: str, item: dict):
    compras = leer_json(COMPRAS_PATH, [])
    compra = next((c for c in compras if c["id"] == compra_id), None)

    if not compra:
        return {
            "error": "Compra no encontrada",
            "canaston_actual": canaston_vacio(),
            "carrito": []
        }

    precio = item.get("precio", 0)

    if precio > compra["monto_restante"]:
        return {
            "error": "Saldo insuficiente",
            "canaston_actual": compra.get("canaston_actual", canaston_vacio()),
            "carrito": compra.get("carrito", [])
        }

    # Registrar compra en carrito
    compra["carrito"].append(item)
    compra["monto_restante"] -= precio

    # Recalcular canastón sugerido (productos restantes que puede comprar)
    catalogo = cargar_catalogo()
    restantes = [
        p for p in catalogo
        if p["precio"] <= compra["monto_restante"] and p not in compra["carrito"]
    ]

    compra["canaston_actual"] = {
        "productos": restantes,
        "total_gastado": round(sum(p["precio"] for p in compra["carrito"]), 2),
        "saldo_restante": round(compra["monto_restante"], 2)
    }

    guardar_json(COMPRAS_PATH, compras)

    return {
        "id": compra["id"],
        "canaston_actual": compra["canaston_actual"],  # Para sugerencias
        "carrito": compra["carrito"]                  # Para mostrar carrito de compras
    }

def finalizar_compra(compra_id: str):
    compras = leer_json(COMPRAS_PATH, [])
    compra = next((c for c in compras if c["id"] == compra_id), None)

    if not compra:
        return {
            "error": "Compra no encontrada"
        }

    # Eliminamos la compra de las activas
    compras = [c for c in compras if c["id"] != compra_id]
    guardar_json(COMPRAS_PATH, compras)

    # Guardar en compras finalizadas
    FINALIZADAS_PATH = DATA_PATH / "compras_finalizadas.json"
    compras_finalizadas = leer_json(FINALIZADAS_PATH, [])

    compra_finalizada = {
        "id": compra["id"],
        "fecha_inicio": compra.get("fecha_inicio"),
        "fecha_fin": datetime.now().isoformat(),
        "carrito": compra.get("carrito", []),
        "total_gastado": round(sum(p["precio"] for p in compra.get("carrito", [])), 2)
    }

    compras_finalizadas.append(compra_finalizada)
    guardar_json(FINALIZADAS_PATH, compras_finalizadas)

    return {
        "mensaje": "Compra finalizada",
        "fecha_fin": compra_finalizada["fecha_fin"],
        "comprados": compra_finalizada["carrito"],
        "total_gastado": compra_finalizada["total_gastado"]
    }

# ---------- canastón ----------
def obtener_ultimo_canaston_por_fecha():
    try:
        if not CANASTONES_PATH.exists():
            return None

        with open(CANASTONES_PATH, "r", encoding="utf-8") as f:
            canastones = json.load(f)

        if not canastones:
            return None

        canastones.sort(
            key=lambda x: x.get("fecha_creacion") or x.get("fecha", ""),
            reverse=True
        )

        ultimo = canastones[0]

        return {
            "productos": ultimo.get("productos", []),
            "total_gastado": ultimo.get("total_gastado", 0),
            "saldo_restante": ultimo.get("saldo_restante", 0),
            "estrategia": ultimo.get("estrategia", "Canastón")
        }

    except Exception as e:
        print(f"Error obteniendo último canastón: {e}")
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


