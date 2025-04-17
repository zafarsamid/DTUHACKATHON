
import { useState, useEffect } from "react";
import { 
  Activity, 
  Calendar, 
  FileText, 
  Pill, 
  Heart, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  Thermometer,
  Droplet,
  Activity as ActivityIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Mock data for vitals
const mockVitals = {
  heartRate: 72,
  bloodPressure: "120/80",
  temperature: 36.6,
  oxygenSaturation: 98,
  glucose: 110
};

// Mock data for upcoming appointments
const mockAppointments = [
  {
    id: 1,
    doctor: "Dr. Patel",
    specialty: "Cardiologist",
    date: "2025-04-20",
    time: "10:30 AM"
  },
  {
    id: 2,
    doctor: "Dr. Singh",
    specialty: "General Physician",
    date: "2025-04-28",
    time: "2:00 PM"
  }
];

// Mock data for medications
const mockMedications = [
  {
    id: 1,
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    remaining: 10
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    remaining: 20
  },
  {
    id: 3,
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    remaining: 5
  }
];

export default function PatientDashboard() {
  const [simulatedHeartRate, setSimulatedHeartRate] = useState(mockVitals.heartRate);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulate changing heart rate
  useEffect(() => {
    const interval = setInterval(() => {
      // Random heart rate between 68 and 76
      setSimulatedHeartRate(Math.floor(Math.random() * 8) + 68);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold mb-2">{simulatedHeartRate} <span className="text-sm font-normal text-muted-foreground">bpm</span></div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-xs text-muted-foreground">Normal range: 60-100 bpm</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 dark:bg-blue-900/20">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
            <ActivityIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold mb-2">{mockVitals.bloodPressure} <span className="text-sm font-normal text-muted-foreground">mmHg</span></div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-xs text-muted-foreground">Normal range: 90/60 - 120/80 mmHg</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 dark:bg-amber-900/20">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold mb-2">{mockVitals.temperature}°C</div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-xs text-muted-foreground">Normal range: 36.1-37.2°C</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-cyan-50 dark:bg-cyan-900/20">
            <CardTitle className="text-sm font-medium">Oxygen Saturation</CardTitle>
            <Droplet className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold mb-2">{mockVitals.oxygenSaturation}% <span className="text-sm font-normal text-muted-foreground">SpO2</span></div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-xs text-muted-foreground">Normal range: 95-100%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>
              Your latest medical documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <FileText className="h-10 w-10 text-blue-500 mr-3 bg-blue-50 p-2 rounded-md" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Annual Checkup Results</h3>
                  <p className="text-xs text-muted-foreground">Updated 2 weeks ago</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <FileText className="h-10 w-10 text-purple-500 mr-3 bg-purple-50 p-2 rounded-md" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Blood Test Report</h3>
                  <p className="text-xs text-muted-foreground">Updated 1 month ago</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <FileText className="h-10 w-10 text-green-500 mr-3 bg-green-50 p-2 rounded-md" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Vaccination Records</h3>
                  <p className="text-xs text-muted-foreground">Updated 3 months ago</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">Upload New Record</Button>
          </CardFooter>
        </Card>
        
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your scheduled doctor visits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="flex flex-col p-3 border rounded-lg">
                  <div className="flex items-start mb-3">
                    <Calendar className="h-10 w-10 text-primary mr-3 bg-primary/10 p-2 rounded-md" />
                    <div>
                      <h3 className="text-sm font-medium">{appointment.doctor}</h3>
                      <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(appointment.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} | {appointment.time}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button size="sm">Join Online</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Book New Appointment</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Medications</CardTitle>
            <CardDescription>
              Your active prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMedications.map((medication) => (
                <div key={medication.id} className="pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{medication.name}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {medication.dosage}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{medication.frequency}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Remaining: {medication.remaining} doses</span>
                    {medication.remaining <= 5 && (
                      <span className="flex items-center text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low stock
                      </span>
                    )}
                  </div>
                  <Progress
                    value={medication.remaining * 5}
                    className={`h-1 mt-1 ${medication.remaining <= 5 ? 'bg-amber-500/30' : ''}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Medications</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
