from fastapi import FastAPI
from pydantic import BaseModel
from services.obtener_cupon import obtener_cupon
from services.obtener_ruta import planificar_ruta
from fastapi.middleware.cors import CORSMiddleware

class SolicitudRuta(BaseModel):
    destino: str
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

@app.post("/obtener_ruta") # Nueva ruta y endpoint
def planificar_ruta_endpoint(data: SolicitudRuta):
    """
    Endpoint para que el Frontend solicite un plan de ruta.
    """
    # Llama al agente planificador con el destino proporcionado por el frontend
    resultado = planificar_ruta(data.destino)
    return resultado