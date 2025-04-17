from fastapi import FastAPI, File, UploadFile, HTTPException
import pdfplumber
import io
import re
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

app = FastAPI()

class VitalSigns(BaseModel):
    temperature: Optional[float] = Field(None, description="Temperature in °F or °C") 
    heart_rate: Optional[int] = Field(None, description="Heart rate in bpm")
    blood_pressure: Optional[str] = Field(None, description="Blood pressure as systolic/diastolic")
    respiratory_rate: Optional[int] = Field(None, description="Respiratory rate in breaths/min")
    oxygen_saturation: Optional[float] = Field(None, description="SpO2 percentage")
    height: Optional[float] = Field(None, description="Height in cm or inches")
    weight: Optional[float] = Field(None, description="Weight in kg or lbs")
    bmi: Optional[float] = Field(None, description="Body Mass Index")
    recorded_time: Optional[datetime] = Field(None, description="When vitals were taken")

class LabResult(BaseModel):
    test_name: str = Field(..., description="Name of the lab test")
    result: str = Field(..., description="Test result value")
    units: Optional[str] = Field(None, description="Measurement units")
    reference_range: Optional[str] = Field(None, description="Normal reference range")
    status: Optional[str] = Field(None, description="High, Low, or Normal")
    notes: Optional[str] = Field(None, description="Any additional notes")

class ClinicalNote(BaseModel):
    note_type: str = Field(..., description="Type of note (History, Assessment, Plan)")
    content: str = Field(..., description="The note content")
    author: Optional[str] = Field(None, description="Author of the note")
    datetime: Optional[datetime] = Field(None, description="When note was created")

class PatientInfo(BaseModel):
    name: Optional[str] = Field(None, description="Patient full name")
    dob: Optional[str] = Field(None, description="Date of birth in MM/DD/YYYY format")
    gender: Optional[str] = Field(None, description="Gender (Male/Female/Other)")
    patient_id: Optional[str] = Field(None, description="Medical record number", alias="mrn")
    date_of_report: Optional[str] = Field(None, description="Report date in MM/DD/YYYY format")

class MedicalReport(BaseModel):
    patient_info: PatientInfo
    vital_signs: List[VitalSigns] = Field(default_factory=list)
    lab_results: List[LabResult] = Field(default_factory=list)
    medications: List[Dict[str, str]] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    clinical_notes: List[ClinicalNote] = Field(default_factory=list)
    problems: List[str] = Field(default_factory=list)

def extract_patient_info(text: str) -> PatientInfo:
    """Robust patient info extraction with multiple pattern fallbacks"""
    patterns = {
        "name": [
            r"(?:Patient|PATIENT)\s*[:]?\s*(.*?)(?=\n|$)",
            r"Name\s*[:]?\s*(.*?)(?=\n|$)",
            r"Patient Name\s*[:]?\s*(.*?)(?=\n|$)"
        ],
        "dob": [
            r"DOB\s*[:]?\s*(\d{2}[/-]\d{2}[/-]\d{4})",
            r"Date of Birth\s*[:]?\s*(\d{2}[/-]\d{2}[/-]\d{4})",
            r"Birth Date\s*[:]?\s*(\d{2}[/-]\d{2}[/-]\d{4})"
        ],
        "gender": [
            r"Sex\s*[:]?\s*([MF])",
            r"Gender\s*[:]?\s*(Male|Female)",
            r"Sex/Gender\s*[:]?\s*(.*?)(?=\n|$)"
        ],
        "patient_id": [
            r"MRN\s*[:]?\s*([A-Za-z0-9-]+)",
            r"Medical Record\s*[:]?\s*([A-Za-z0-9-]+)",
            r"Patient ID\s*[:]?\s*([A-Za-z0-9-]+)"
        ],
        "date_of_report": [
            r"Date\s*[:]?\s*(\d{2}[/-]\d{2}[/-]\d{4})",
            r"Report Date\s*[:]?\s*(\d{2}[/-]\d{2}[/-]\d{4})",
            r"Created On\s*[:]?\s*(\d{2}[/-]\d{2}[/-]\d{4})"
        ]
    }
    
    extracted = {}
    for field, pattern_list in patterns.items():
        for pattern in pattern_list:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                extracted[field] = match.group(1).strip()
                break
    
    return PatientInfo(**extracted)

def extract_vitals(text: str) -> List[VitalSigns]:
    """Enhanced vital signs extraction with unit awareness"""
    vitals = []
    vital_data = {}
    
    # Blood pressure 
    bp_match = re.search(r"(?:BP|Blood Pressure)\s*[:]?\s*(\d{2,3}/\d{2,3})", text)
    if bp_match:
        vital_data["blood_pressure"] = bp_match.group(1)
    
    # Temperature with unit detection
    temp_match = re.search(r"(?:Temp|Temperature)\s*[:]?\s*(\d{2,3}\.?\d*)\s*[°CF]?", text, re.IGNORECASE)
    if temp_match:
        vital_data["temperature"] = float(temp_match.group(1))
    
    # Heart rate extraction
    hr_match = re.search(r"(?:HR|Heart Rate)\s*[:]?\s*(\d{2,3})\s*(?:bpm)?", text, re.IGNORECASE)
    if hr_match:
        vital_data["heart_rate"] = int(hr_match.group(1))
    
    # Oxygen saturation
    spo2_match = re.search(r"(?:SpO2|Oxygen Sat)\s*[:]?\s*(\d{2,3})\s*%?", text, re.IGNORECASE)
    if spo2_match:
        vital_data["oxygen_saturation"] = float(spo2_match.group(1))
    
    # Weight with unit conversion
    weight_match = re.search(r"(?:Weight|WT)\s*[:]?\s*(\d{2,3}\.?\d*)\s*(kg|lbs|lb)?", text, re.IGNORECASE)
    if weight_match:
        weight = float(weight_match.group(1))
        unit = weight_match.group(2)
        if unit and "lb" in unit.lower():
            weight *= 0.453592  
        vital_data["weight"] = weight
    
    # Height with unit conversion
    height_match = re.search(r"(?:Height|HT)\s*[:]?\s*(\d+\.?\d*)\s*(cm|in)?", text, re.IGNORECASE)
    if height_match:
        height = float(height_match.group(1))
        unit = height_match.group(2)
        if unit and "in" in unit.lower():
            height *= 2.54 
        vital_data["height"] = height
    
    # Calculate BMI if both height and weight are available
    if "height" in vital_data and "weight" in vital_data:
        if vital_data["height"] > 0 and vital_data["weight"] > 0:
            vital_data["bmi"] = round(vital_data["weight"]) / ((vital_data["height"]/100) ** 2, 1)
    
    if vital_data:
        vitals.append(VitalSigns(**vital_data))
    
    return vitals

def extract_clinical_notes(text: str) -> List[ClinicalNote]:
    """Improved clinical note extraction with section detection"""
    notes = []
    
    history_patterns = [
        r"History[:\s]*(.*?)(?=\n\s*Assessment|\n\s*Physical Exam|\n\s*[A-Z][a-z]+:)",
        r"HISTORY OF PRESENT ILLNESS[:\s]*(.*?)(?=\n\s*[A-Z]+:)",
        r"HPI[:\s]*(.*?)(?=\n\s*[A-Z]+:)"
    ]
    
    for pattern in history_patterns:
        if match := re.search(pattern, text, re.DOTALL | re.IGNORECASE):
            notes.append(ClinicalNote(
                note_type="History",
                content=match.group(1).strip()
            ))
            break
    
    # Assessment section
    if match := re.search(r"Assessment[:\s]*(.*?)(?=\n\s*Plan|\n\s*[A-Z][a-z]+:)", text, re.DOTALL | re.IGNORECASE):
        notes.append(ClinicalNote(
            note_type="Assessment",
            content=match.group(1).strip()
        ))
    
    # Plan section
    if match := re.search(r"Plan[:\s]*(.*?)(?=\n\s*[A-Z][a-z]+:|$)", text, re.DOTALL | re.IGNORECASE):
        notes.append(ClinicalNote(
            note_type="Plan",
            content=match.group(1).strip()
        ))
    
    return notes

@app.post("/extract-clinical-data")
async def extract_clinical_data(file: UploadFile = File(...)):
    """Main endpoint with improved error handling"""
    if file.content_type != "application/pdf":
        raise HTTPException(400, detail="File must be a PDF")

    try:
        pdf_bytes = await file.read()
        
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            full_text = "\n".join(
                page.extract_text() or "" 
                for page in pdf.pages
            )
            
            patient_info = extract_patient_info(full_text)
            vitals = extract_vitals(full_text)
            clinical_notes = extract_clinical_notes(full_text)
            
            allergies = []
            if allergy_match := re.search(r"Allerg(?:y|ies)[:\s]*(.*?)(?=\n\s*[A-Z][a-z]+:)", full_text, re.IGNORECASE):
                allergies = [
                    a.strip() 
                    for a in re.split(r",|\n", allergy_match.group(1)) 
                    if a.strip()
                ]
            
            problems = []
            if problem_match := re.search(r"Problem[s]?[:\s]*(.*?)(?=\n\s*[A-Z][a-z]+:)", full_text, re.IGNORECASE):
                problems = [
                    p.strip() 
                    for p in re.split(r",|\n", problem_match.group(1)) 
                    if p.strip()
                ]
            
            report_data = {
                "patient_info": patient_info.dict(),
                "vital_signs": [v.dict() for v in vitals],
                "clinical_notes": [n.dict() for n in clinical_notes],
                "allergies": allergies,
                "problems": problems,
                "lab_results": [],
                "medications": []
            }
            
            # Validate but don't fail on partial data
            try:
                validated_report = MedicalReport(**report_data)
                return {
                    "filename": file.filename,
                    "report": validated_report.dict(),
                    "status": "complete"
                }
            except Exception as validation_error:
                return {
                    "filename": file.filename,
                    "report": report_data,
                    "status": "partial",
                    "validation_warning": str(validation_error)
                }

    except Exception as e:
        raise HTTPException(500, detail=f"Processing error: {str(e)}")

@app.post("/debug-extract-text")
async def debug_extract_text(file: UploadFile = File(...)):
    """Debug endpoint to see raw extracted text"""
    try:
        pdf_bytes = await file.read()
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            full_text = "\n".join(
                page.extract_text() or "<<NO TEXT>>" 
                for page in pdf.pages
            )
            
            pattern_checks = {
                "patient_name": bool(re.search(r"Patient|Name", full_text, re.IGNORECASE)),
                "dob": bool(re.search(r"DOB|Date of Birth", full_text, re.IGNORECASE)),
                "mrn": bool(re.search(r"MRN|Medical Record", full_text, re.IGNORECASE)),
                "vitals": bool(re.search(r"Blood Pressure|Temp|HR|SpO2", full_text, re.IGNORECASE)),
                "allergies": bool(re.search(r"Allerg(?:y|ies)", full_text, re.IGNORECASE))
            }
            
            return {
                "filename": file.filename,
                "text_sample": full_text[:1000] + ("..." if len(full_text) > 1000 else ""),
                "pattern_checks": pattern_checks,
                "page_count": len(pdf.pages)
            }
    except Exception as e:
        raise HTTPException(500, detail=str(e))