import json
from pathlib import Path
from datetime import datetime
import uuid

DATA_PATH = Path(__file__).parent.parent / "data" / "canastones_guardados.json"


def guardar_canaston(canaston: dict):
    # Cargar existentes
    if DATA_PATH.exists():
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            historial = json.load(f)
    else:
        historial = []

    # Crear registro persistente
    registro = {
        "id": str(uuid.uuid4()),
        "fecha": datetime.now().isoformat(),
        "canaston": canaston
    }

    historial.append(registro)

    # Guardar
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(historial, f, indent=2, ensure_ascii=False)

    return {
        "mensaje": "Canastón guardado correctamente",
        "id": registro["id"]
    }


def leer_canastones():
    if not DATA_PATH.exists():
        return []

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
