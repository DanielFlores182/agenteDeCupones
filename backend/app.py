from fastapi import FastAPI
from services.obtener_cupon import obtener_cupon
from fastapi.middleware.cors import CORSMiddleware
from services.obtener_sugerencias import agente_cupon

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)


@app.post("/obtener_cupon")
def obtener_cupon_endpoint(data: dict):
    resultado = obtener_cupon(data)
    return resultado

@app.post("/recomendar_productos")
def recomendar_productos(data: dict):
    monto = data.get("monto")
    preferencia = data.get("preferencia")

    if monto is None:
        return { "error": "El monto del cupón es requerido" }

    return agente_cupon(monto, preferencia)
