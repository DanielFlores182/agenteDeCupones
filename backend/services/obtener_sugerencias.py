import json
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "data" / "productos.json"


def cargar_productos():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def agente_cupon(monto: float, preferencia: str | None = None):
    productos = cargar_productos()

    # 1. Selección del espacio de búsqueda
    if preferencia and preferencia in productos:
        catalogo = productos[preferencia]
    else:
        catalogo = [
            item
            for categoria in productos.values()
            for item in categoria
        ]

    # 2. Estrategia simple: ordenar por precio ascendente
    catalogo = sorted(catalogo, key=lambda x: x["precio"])

    seleccion = []
    total = 0

    # 3. Decisión (agente racional)
    for producto in catalogo:
        if total + producto["precio"] <= monto:
            seleccion.append(producto)
            total += producto["precio"]

    # 4. Acción (resultado)
    return {
        "monto_cupon": monto,
        "preferencia": preferencia,
        "productos_recomendados": seleccion,
        "total_gastado": total,
        "saldo_restante": round(monto - total, 2)
    }
