from typing import List, Dict, Any, Optional
from pathlib import Path
import csv
import os

import random

from fastapi import FastAPI, status,Body,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
)
from pydantic import BaseModel

csv_data=[]


# Upload CSV to Memory
def load_csv():
    global csv_data
    try:
        with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
            reader = list(csv.DictReader(csvfile))
            if not reader:
                raise ValueError("CSV file is empty.")
            csv_data = reader  
            print(f"✅ {len(csv_data)} LLMs uploaded from CSV")
    except FileNotFoundError:
        print(f"❌ CSV file not found at {CSV_PATH}")
        csv_data = []

# Lifespan: upload CSV on app start
async def lifespan(app: FastAPI):
    print("🚀 Starting FastAPI Application...")
    #print(f"data: {csv_data}")
    load_csv()
    #print(f"data: {csv_data}")
    yield  
    print("🛑 Closing FastAPI Application...")

# Initialize FastAPI with lifespan
app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # PermeAllow requests from React
    allow_credentials=True,
    allow_methods=["*"],  # Allows all Methods (GET, POST, ecc.)
    allow_headers=["*"],  # Allows all Headers
)

llms_collection: AsyncIOMotorCollection = AsyncIOMotorClient(
    "mongodb://root:example@mongodb:27017"
)["plino"]["llms"]

#define the model for LLM, taking into account the structure given by the csv file
class LLM(BaseModel):
    company: str
    category: str
    release_date: str
    model_name: str
    num_million_parameters: int
    _id: str  # Optional, will be converted from ObjectId a stringa

class GetLLMsResponseBody(BaseModel):
    llms: List[LLM]
# Get absolute CSV path relative to the project's root 
BASE_DIR = Path(__file__).resolve().parent.parent  # Go to project's root
CSV_PATH = BASE_DIR / "data" / "llms.csv"  

@app.get("/")
async def read_root():
    return {"Hello": "Plino"}


@app.post("/llm", status_code=status.HTTP_201_CREATED)
async def create_llm(body: Optional[Dict[str, Any]] = Body(None)):
    """
    1. If an LLM is received via request body, it is validated and inserted if not duplicated.
    2. If no LLM is received, a random LLM is read from `data/llms.csv` and inserted.
    """
    if body:  # If the body is not empty, validate the received data
        try:
            llm = LLM(**body)  # Manual validation with Pydantic
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid LLM data: {str(e)}")

        # 🛑 Check if the model already exists
        existing_llm = await llms_collection.find_one({"model_name": llm.model_name})
        if existing_llm:
            raise HTTPException(status_code=400, detail="LLM already exists in the database.")

        # ✅ Insert the new LLM and get the ID
        insert_result = await llms_collection.insert_one(llm.dict())
        llm_dict = llm.dict()
        llm_dict["_id"] = str(insert_result.inserted_id)  # Convert ObjectId to string
        return {"message": "LLM added successfully", "llm": llm.dict()}

    try:  # 🔄 If no data is received in POST, take an LLM from memory
        if not csv_data:
            raise HTTPException(status_code=500, detail="CSV data is not loaded in memory.")

        random_llm = random.choice(csv_data)

        # Convert the correct values (CSV stores everything as strings)
        random_llm["num_million_parameters"] = int(random_llm["num_million_parameters"])

        # 🛑 Check if it already exists in the database
        existing_llm = await llms_collection.find_one({"model_name": random_llm["model_name"]})
        if existing_llm:
            raise HTTPException(status_code=400, detail="Random LLM already exists in the database.")

        # ✅ Insert the new LLM
        insert_result = await llms_collection.insert_one(random_llm)
        random_llm["_id"] = str(insert_result.inserted_id)

        return {"message": "Random LLM added successfully", "llm": random_llm}
    
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail=f"CSV file not found at {CSV_PATH}")


@app.get("/llms", response_model=List[LLM])
async def get_llms():
    """
    Retrieves all LLMs from the database and returns them as a list.
    """
    llms = []
    async for llm in llms_collection.find():
        llm["_id"] = str(llm["_id"])  # Convert ObjectId to string
        llms.append(llm)

    return llms
