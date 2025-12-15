import json
import random
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "data" / "productos.json"


def cargar_productos():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def construir_canaston(catalogo, monto):
    seleccion = []
    total = 0

    for producto in catalogo:
        if total + producto["precio"] <= monto:
            seleccion.append(producto)
            total += producto["precio"]

    return {
        "productos": seleccion,
        "total_gastado": total,
        "saldo_restante": round(monto - total, 2)
    }


def agente_cupon(monto: float, preferencia: str | None = None, cantidad: int = 6):
    productos = cargar_productos()

    # 1. Filtrado por preferencia
    if preferencia and preferencia in productos:
        base_catalogo = productos[preferencia]
    else:
        base_catalogo = [
            item
            for categoria in productos.values()
            for item in categoria
        ]

    canastones = []

    # 2. Estrategia 1: más barato primero
    catalogo = sorted(base_catalogo, key=lambda x: x["precio"])
    canastones.append({
        "estrategia": "mas_barato",
        **construir_canaston(catalogo, monto)
    })

    # 3. Estrategia 2: más caro primero
    catalogo = sorted(base_catalogo, key=lambda x: x["precio"], reverse=True)
    canastones.append({
        "estrategia": "mas_caro",
        **construir_canaston(catalogo, monto)
    })

    # 4. Estrategia 3: balanceado (precio medio)
    catalogo = sorted(
        base_catalogo,
        key=lambda x: abs(x["precio"] - monto / len(base_catalogo))
    )
    canastones.append({
        "estrategia": "balanceado",
        **construir_canaston(catalogo, monto)
    })

    # 5–6. Estrategias aleatorias
    for i in range(cantidad - 3):
        catalogo = base_catalogo[:]
        random.shuffle(catalogo)
        canastones.append({
            "estrategia": f"aleatorio_{i+1}",
            **construir_canaston(catalogo, monto)
        })

    return {
        "monto_cupon": monto,
        "preferencia": preferencia,
        "cantidad_canastones": len(canastones),
        "canastones": canastones
    }
