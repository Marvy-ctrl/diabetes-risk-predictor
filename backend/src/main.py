import os
import pickle
import numpy as np
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
frontend_url = os.getenv("FRONTEND_URL")

app = FastAPI(title="Diabetes Prediction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url] if frontend_url else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FEATURES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]


class UserInput(BaseModel):
    Gender: str = Field(..., description="Gender of the patient: male or female")
    Glucose: float = Field(..., ge=0)
    BloodPressure: float = Field(..., ge=0)
    SkinThickness: float = Field(..., ge=0)
    Insulin: float = Field(..., ge=0)
    Age: int = Field(..., ge=0)
    Weight: float = Field(..., ge=0)
    Height: float = Field(..., gt=0)
    Pregnancies: int | None = Field(None, ge=0)
    FamilyParents: int = Field(0, ge=0, le=2)
    FamilySiblings: int = Field(0, ge=0, le=4)
    FamilyGrandparents: int = Field(0, ge=0, le=4)


def preprocess_input(data: UserInput) -> np.ndarray:
    try:
        bmi = round(float(data.Weight) / (float(data.Height) ** 2), 2)

        pregnancies = 0 if data.Gender.lower() == "male" else int(data.Pregnancies or 0)

        dpf = (
            0.5 * (data.FamilyParents or 0)
            + 0.1 * (data.FamilySiblings or 0)
            + 0.25 * (data.FamilyGrandparents or 0)
        )
        dpf = min(dpf, 1.0)
        dpf = round(dpf, 3)

        processed = np.array(
            [
                [
                    pregnancies,
                    int(data.Glucose),
                    int(data.BloodPressure),
                    int(data.SkinThickness),
                    int(data.Insulin),
                    bmi,
                    dpf,
                    int(data.Age),
                ]
            ]
        )
        print({"data": data})
        print({"processed data": processed[0]})
        return processed

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Preprocessing error: {str(e)}")


try:
    model_path = "src/ml_model/diabetes_model.sav"
    scaler_path = "src/ml_model/scaler.sav"

    with open(model_path, "rb") as model_file:
        model = pickle.load(model_file)

    with open(scaler_path, "rb") as scaler_file:
        scaler = pickle.load(scaler_file)

except Exception as e:
    raise RuntimeError(f"Failed to load model or scaler: {str(e)}")


@app.get("/")
def root():
    return {"message": "Diabetes Risk Predictor API is running 🚀"}


@app.post("/diabetes_prediction")
def diabetes_prediction(input_data: UserInput):

    processed_data = preprocess_input(input_data)

    scaled_data = scaler.transform(pd.DataFrame(processed_data, columns=FEATURES))
    prediction = model.predict(scaled_data)

    label = "Diabetic" if int(prediction[0]) == 1 else "Not Diabetic"

    try:
        probability = model.predict_proba(scaled_data)[0]
        confidence = round(float(max(probability)) * 100, 2)
    except AttributeError:
        confidence = None

    return {
        "status": "success",
        "prediction": int(prediction[0]),
        "message": label,
        "confidence": f"{confidence:.2f}%",
    }
