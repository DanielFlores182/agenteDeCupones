
import json
from pathlib import Path

CANASTONES_FILE = Path(__file__).parent.parent / "canastones_guardados.json"

def cargar_ultimo_cupon():
    """
    Devuelve el último canastón guardado.
    """
    if not CANASTONES_FILE.exists():
        return {"error": "No hay canastones guardados"}

    with open(CANASTONES_FILE, "r", encoding="utf-8") as f:
        canastones = json.load(f)

    if not canastones:
        return {"error": "No hay canastones guardados"}

    return canastones[-1]  # devuelve el último
