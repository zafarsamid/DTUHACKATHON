
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, AlertTriangle, Stethoscope, ThermometerSnowflake, Pill, Activity } from "lucide-react";
import { toast } from "sonner";

interface Symptom {
  id: string;
  name: string;
  category: "common" | "respiratory" | "digestive" | "neurological";
}

interface DiseasePrediction {
  disease: string;
  probability: number;
  description: string;
  severity: "low" | "medium" | "high";
  recommendations: string[];
}

// Mock symptoms list
const symptoms: Symptom[] = [
  // Common symptoms
  { id: "fever", name: "Fever", category: "common" },
  { id: "fatigue", name: "Fatigue", category: "common" },
  { id: "headache", name: "Headache", category: "common" },
  { id: "body_ache", name: "Body ache", category: "common" },
  { id: "sore_throat", name: "Sore throat", category: "common" },
  { id: "chills", name: "Chills", category: "common" },
  { id: "dizziness", name: "Dizziness", category: "common" },
  // Respiratory symptoms
  { id: "cough", name: "Cough", category: "respiratory" },
  { id: "short_breath", name: "Shortness of breath", category: "respiratory" },
  { id: "chest_pain", name: "Chest pain", category: "respiratory" },
  { id: "nasal_congestion", name: "Nasal congestion", category: "respiratory" },
  { id: "runny_nose", name: "Runny nose", category: "respiratory" },
  // Digestive symptoms
  { id: "nausea", name: "Nausea", category: "digestive" },
  { id: "vomiting", name: "Vomiting", category: "digestive" },
  { id: "diarrhea", name: "Diarrhea", category: "digestive" },
  { id: "abdominal_pain", name: "Abdominal pain", category: "digestive" },
  { id: "loss_appetite", name: "Loss of appetite", category: "digestive" },
  // Neurological symptoms
  { id: "confusion", name: "Confusion", category: "neurological" },
  { id: "seizure", name: "Seizure", category: "neurological" },
  { id: "weakness", name: "Weakness", category: "neurological" },
  { id: "speech_issues", name: "Speech issues", category: "neurological" },
  { id: "vision_issues", name: "Vision issues", category: "neurological" },
];

// Mock disease prediction logic
const predictDisease = (selectedSymptoms: string[], temperature: number, additionalNotes: string): DiseasePrediction[] => {
  const hasSymptom = (id: string) => selectedSymptoms.includes(id);
  
  const predictions: DiseasePrediction[] = [];
  
  // Common Cold prediction
  if (
    (hasSymptom("cough") || hasSymptom("runny_nose") || hasSymptom("nasal_congestion")) &&
    hasSymptom("sore_throat") && 
    (temperature >= 36.5 && temperature <= 38)
  ) {
    predictions.push({
      disease: "Common Cold",
      probability: 0.85,
      description: "A viral infection of the upper respiratory tract that typically causes inflammation of the nasal passages.",
      severity: "low",
      recommendations: [
        "Rest and stay hydrated",
        "Over-the-counter cold medicines may relieve symptoms",
        "Consult a doctor if symptoms persist for more than a week"
      ]
    });
  }
  
  // Influenza (Flu) prediction
  if (
    hasSymptom("fever") && 
    hasSymptom("body_ache") && 
    (hasSymptom("cough") || hasSymptom("fatigue")) &&
    temperature >= 38
  ) {
    predictions.push({
      disease: "Influenza (Flu)",
      probability: 0.78,
      description: "A highly contagious viral infection that attacks the respiratory system.",
      severity: "medium",
      recommendations: [
        "Rest and stay hydrated",
        "Take fever-reducing medication if needed",
        "Consult a doctor within 48 hours for antiviral medication"
      ]
    });
  }
  
  // COVID-19 prediction
  if (
    hasSymptom("fever") && 
    hasSymptom("cough") && 
    (hasSymptom("fatigue") || hasSymptom("short_breath"))
  ) {
    predictions.push({
      disease: "COVID-19",
      probability: 0.62,
      description: "A respiratory illness caused by the SARS-CoV-2 virus.",
      severity: "medium",
      recommendations: [
        "Get tested for COVID-19",
        "Self-isolate to prevent spread",
        "Contact a healthcare provider for guidance",
        "Monitor oxygen levels if possible"
      ]
    });
  }
  
  // Gastroenteritis prediction
  if (
    hasSymptom("nausea") && 
    (hasSymptom("vomiting") || hasSymptom("diarrhea")) &&
    (hasSymptom("abdominal_pain") || hasSymptom("fever"))
  ) {
    predictions.push({
      disease: "Gastroenteritis",
      probability: 0.74,
      description: "Inflammation of the stomach and intestines, typically resulting from infection.",
      severity: "medium",
      recommendations: [
        "Stay hydrated with clear fluids",
        "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast)",
        "Rest and avoid solid foods until symptoms improve",
        "Seek medical attention if unable to keep fluids down or symptoms persist"
      ]
    });
  }
  
  // Migraine prediction
  if (
    hasSymptom("headache") && 
    (hasSymptom("vision_issues") || hasSymptom("nausea")) && 
    hasSymptom("dizziness")
  ) {
    predictions.push({
      disease: "Migraine",
      probability: 0.81,
      description: "A neurological condition characterized by intense, debilitating headaches.",
      severity: "medium",
      recommendations: [
        "Rest in a dark, quiet room",
        "Apply cold or warm compresses to the head",
        "Take prescribed migraine medication if available",
        "Consider preventive measures if migraines are frequent"
      ]
    });
  }
  
  // Stroke warning
  if (
    hasSymptom("speech_issues") && 
    hasSymptom("weakness") && 
    hasSymptom("vision_issues") &&
    hasSymptom("confusion")
  ) {
    predictions.push({
      disease: "Possible Stroke",
      probability: 0.89,
      description: "A medical emergency where blood supply to the brain is interrupted or reduced.",
      severity: "high",
      recommendations: [
        "SEEK EMERGENCY MEDICAL ATTENTION IMMEDIATELY",
        "Call emergency services (911) right away",
        "Note the time when symptoms first appeared",
        "Do not drive yourself to the hospital"
      ]
    });
  }
  
  if (predictions.length === 0) {
    // If no specific disease pattern matched
    predictions.push({
      disease: "No specific condition identified",
      probability: 0.4,
      description: "Your symptoms don't match any specific pattern in our system.",
      severity: "low",
      recommendations: [
        "Rest and monitor your symptoms",
        "Stay hydrated and get adequate sleep",
        "Consult with a healthcare provider if symptoms persist or worsen"
      ]
    });
  }
  
  return predictions.sort((a, b) => b.probability - a.probability);
};

export default function DiseasePredictionPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<number>(37.0);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [predictions, setPredictions] = useState<DiseasePrediction[] | null>(null);
  const [symptomDuration, setSymptomDuration] = useState<string>("1-3 days");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = predictDisease(selectedSymptoms, temperature, additionalNotes);
      setPredictions(results);
      setIsLoading(false);
      
      // Show high severity alerts as toasts
      results.forEach(prediction => {
        if (prediction.severity === "high") {
          toast.error(`URGENT: ${prediction.disease} detected. Seek immediate medical attention.`);
        }
      });
      
    }, 2000);
  };
  
  const handleReset = () => {
    setSelectedSymptoms([]);
    setTemperature(37.0);
    setAdditionalNotes("");
    setSymptomDuration("1-3 days");
    setPredictions(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disease Prediction</h1>
        <p className="text-muted-foreground">
          Enter your symptoms to get a preliminary assessment. This is not a substitute for professional medical advice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Symptom Assessment
            </CardTitle>
            <CardDescription>
              Select all symptoms you are currently experiencing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="common" className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="common">Common</TabsTrigger>
                  <TabsTrigger value="respiratory">Respiratory</TabsTrigger>
                  <TabsTrigger value="digestive">Digestive</TabsTrigger>
                  <TabsTrigger value="neurological">Neurological</TabsTrigger>
                </TabsList>
                
                {["common", "respiratory", "digestive", "neurological"].map((category) => (
                  <TabsContent key={category} value={category} className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {symptoms
                        .filter(symptom => symptom.category === category)
                        .map(symptom => (
                          <div key={symptom.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={symptom.id}
                              checked={selectedSymptoms.includes(symptom.id)}
                              onCheckedChange={() => handleSymptomToggle(symptom.id)}
                            />
                            <Label htmlFor={symptom.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {symptom.name}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Symptom Duration</Label>
                  <select 
                    id="duration" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                  >
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="3-7 days">3-7 days</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="More than 2 weeks">More than 2 weeks</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Body Temperature (°C)</Label>
                    <span className="text-sm">{temperature.toFixed(1)}°C</span>
                  </div>
                  <Slider
                    id="temperature"
                    min={35}
                    max={42}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={([value]) => setTemperature(value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>35°C</span>
                    <span className="text-blue-500">Normal: 36.1-37.2°C</span>
                    <span className="text-red-500">Fever: {'>'}37.5°C</span>
                    <span>42°C</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <textarea 
                    id="notes" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any other symptoms or concerns..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Analyzing..." : "Analyze Symptoms"}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Assessment</CardTitle>
            <CardDescription>
              {predictions 
                ? `Based on ${selectedSymptoms.length} symptoms` 
                : "Complete the form to see results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-pulse flex flex-col items-center">
                  <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
                  <p>Analyzing your symptoms...</p>
                  <Progress value={65} className="mt-4 w-full" />
                </div>
              </div>
            ) : predictions ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div 
                        className={`p-4 ${
                          prediction.severity === 'high' 
                            ? 'bg-red-50 dark:bg-red-900/20' 
                            : prediction.severity === 'medium'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20'
                            : 'bg-green-50 dark:bg-green-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{prediction.disease}</h3>
                          {prediction.severity === 'high' && (
                            <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/40 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Urgent
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Match probability</span>
                            <span>{Math.round(prediction.probability * 100)}%</span>
                          </div>
                          <Progress 
                            value={prediction.probability * 100} 
                            className={`h-2 mt-1 ${
                              prediction.severity === 'high' 
                                ? 'bg-red-200 [&>div]:bg-red-600' 
                                : prediction.severity === 'medium'
                                ? 'bg-yellow-200 [&>div]:bg-yellow-600'
                                : 'bg-green-200 [&>div]:bg-green-600'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-sm mb-3">{prediction.description}</p>
                        
                        <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No assessment yet</h3>
                <p className="text-muted-foreground mt-1">Select your symptoms and submit the form</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Alert variant="destructive" className="w-full">
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Medical Disclaimer
              </AlertTitle>
              <AlertDescription className="text-xs">
                This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
