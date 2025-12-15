import json
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "data" / "productos.json"


def cargar_productos():
    """
    Devuelve todos los productos del supermercado.
    Retorna un diccionario con categorías y productos.
    """
    if not DATA_PATH.exists():
        return { "error": "No se encontró el archivo de productos" }

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        productos = json.load(f)

    return productos
