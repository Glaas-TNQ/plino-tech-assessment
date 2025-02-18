from typing import List, Dict, Any, Optional
from pathlib import Path
import csv
import os

import random

from fastapi import FastAPI, status,Body,HTTPException
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
)
from pydantic import BaseModel


app = FastAPI()
llms_collection: AsyncIOMotorCollection = AsyncIOMotorClient(
    "mongodb://root:example@mongodb:27017"
)["plino"]["llms"]

#definre the model for LLM, taking into account the structure given by the csv file
class LLM(BaseModel):
    company: str
    category: str
    release_date: str
    model_name: str
    num_million_parameters: int
    _id: str  # Facoltativo, sarà convertito da ObjectId a stringa

class GetLLMsResponseBody(BaseModel):
    llms: List[LLM]
# Ottieni il percorso assoluto del file CSV rispetto alla root del progetto
BASE_DIR = Path(__file__).resolve().parent.parent  # Va alla root del progetto
CSV_PATH = BASE_DIR / "data" / "llms.csv"  # Percorso completo corretto

@app.get("/")
async def read_root():
    return {"Hello": "World"}



@app.post("/llm", status_code=status.HTTP_201_CREATED)
async def create_llm(body: Optional[Dict[str, Any]] = Body(None)):
    """
    1. Se riceve un LLM via request body, lo valida e lo inserisce se non è duplicato.
    2. Se non riceve un LLM, legge un LLM casuale da `data/llms.csv` e lo inserisce.
    """
    if body:  # Se il body non è vuoto, validiamo i dati ricevuti
        try:
            llm = LLM(**body)  # Validazione manuale con Pydantic
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid LLM data: {str(e)}")

        # 🛑 Controlliamo se il modello esiste già
        existing_llm = await llms_collection.find_one({"model_name": llm.model_name})
        if existing_llm:
            raise HTTPException(status_code=400, detail="LLM already exists in the database.")

         # ✅ Inseriamo il nuovo LLM e otteniamo l'ID
        insert_result = await llms_collection.insert_one(llm.dict())
        llm_dict = llm.dict()
        llm_dict["_id"] = str(insert_result.inserted_id)  # Convertiamo ObjectId in stringa
        return {"message": "LLM added successfully", "llm": llm.dict()}

    try: # 🔄 Se non riceviamo dati in POST, prendiamo un LLM dal CSV
        with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
            reader = list(csv.DictReader(csvfile))
            if not reader:
                raise HTTPException(status_code=500, detail="CSV file is empty.")
            
            random_llm = random.choice(reader)

            # Convertiamo i valori giusti (il CSV ha tutto come stringhe)
            random_llm["num_million_parameters"] = int(random_llm["num_million_parameters"])

            # 🛑 Controlliamo se già esiste in DB
            existing_llm = await llms_collection.find_one({"model_name": random_llm["model_name"]})
            if existing_llm:
                raise HTTPException(status_code=400, detail="Random LLM already exists in the database.")

            # ✅ Inseriamo il nuovo LLM
            insert_result = await llms_collection.insert_one(random_llm)
            random_llm_dict = random_llm
            random_llm_dict["_id"] = str(insert_result.inserted_id) 
            return {"message": "Random LLM added successfully", "llm": random_llm_dict}
    
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail=f"CSV file not found at {CSV_PATH}")
    


@app.get("/llms", response_model=List[LLM])
async def get_llms():
    """
    Recupera tutti gli LLM dal database e li restituisce come lista.
    """
    llms = []
    async for llm in llms_collection.find():
        llm["_id"] = str(llm["_id"])  # Converte ObjectId in stringa
        llms.append(llm)

    return llms