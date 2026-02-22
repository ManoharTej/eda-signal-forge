from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from ml_engine import engine

app = FastAPI(title="Signal Forge Forensic Lab Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisInput(BaseModel):
    raw_data: List[float]
    mode: str  # "solo" or "hybrid"
    techniques: List[str] # List of algorithms to use

class BenchmarkInput(BaseModel):
    raw_data: List[float]

@app.get("/")
def read_root():
    return {"status": "Forensic Lab Node Active", "version": "4.0.0"}

@app.post("/analyze")
async def analyze(input_data: AnalysisInput):
    """
    Main entry point for both live and batch forensic analysis.
    """
    try:
        raw_array = np.array(input_data.raw_data)
        
        if input_data.mode == "solo":
            tech = input_data.techniques[0] if input_data.techniques else "cul"
            refined_array = engine.run_solo(tech, raw_array)
        else:
            refined_array = engine.run_hybrid(input_data.techniques, raw_array)
        
        # Calculate Auditor Metrics
        metrics = engine.calculate_metrics(raw_array, refined_array)
        
        return {
            "refined_data": refined_array.tolist(),
            "metrics": metrics,
            "mode_used": input_data.mode,
            "algorithms": input_data.techniques
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TelemetryLog(BaseModel):
    User_ID: str
    Age: str
    Gen: str
    BSR: float
    Win: int
    EDA_Mean: float
    EDA_Std: float
    SCL_Tonic: float
    SCR_Peaks: int
    SCR_Amp: float
    Slope_Max: float
    HF_Energy: float
    Entropy: float
    Motion: float

@app.post("/log_telemetry")
async def log_telemetry(data: TelemetryLog):
    """
    Automatically appends telemetry features to a persistent CSV for ML training.
    """
    import pandas as pd
    import os
    
    file_path = "telemetry_database.csv"
    new_row = data.dict()
    df = pd.DataFrame([new_row])
    
    # Append to CSV, create header only if file is new
    header = not os.path.exists(file_path)
    df.to_csv(file_path, mode='a', index=False, header=header)
    
    return {"status": "Logged", "file": file_path}

@app.post("/benchmark")
async def benchmark(input_data: BenchmarkInput):
    """
    Brute-force analysis of all 127 ML combinations.
    """
    try:
        raw_array = np.array(input_data.raw_data)
        results = engine.run_brute_force_benchmark(raw_array)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/live_reconstruct")
async def live_reconstruct(input_data: dict):
    """
    Legacy support for monitor page, now routes to new logic.
    """
    val = input_data.get("raw_val")
    hist = input_data.get("history", [])
    
    # Pack into a small window for the engine
    window = np.array(hist + [val])
    # For live, we default to CUL-v4 as it's the most stable for streams
    refined = engine.run_solo("cul", window)
    
    return {"refined": float(refined[-1])}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
