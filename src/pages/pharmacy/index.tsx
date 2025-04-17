
import { useState, useEffect } from "react";
import {
  BarChart3,
  Search,
  Package,
  FileText,
  Bell,
  AlertCircle,
  Clock,
  CheckCircle2,
  Pill,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock data for medication stock
const mockMedications = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Analgesic",
    stock: 230,
    threshold: 50,
    expiry: "2026-08-15"
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    stock: 45,
    threshold: 40,
    expiry: "2025-11-20"
  },
  {
    id: 3,
    name: "Lisinopril 10mg",
    category: "Hypertension",
    stock: 78,
    threshold: 30,
    expiry: "2026-03-10"
  },
  {
    id: 4,
    name: "Metformin 500mg",
    category: "Diabetes",
    stock: 112,
    threshold: 40,
    expiry: "2026-05-22"
  },
  {
    id: 5,
    name: "Atorvastatin 20mg",
    category: "Cholesterol",
    stock: 25,
    threshold: 30,
    expiry: "2025-12-15"
  }
];

// Mock data for prescriptions
const mockPrescriptions = [
  {
    id: 101,
    patientName: "Rahul Sharma",
    doctorName: "Dr. Anil Patel",
    medications: [
      { name: "Lisinopril 10mg", dosage: "1 tablet daily", duration: "30 days" },
      { name: "Atorvastatin 20mg", dosage: "1 tablet at night", duration: "30 days" }
    ],
    date: "2025-04-16",
    status: "pending"
  },
  {
    id: 102,
    patientName: "Priya Singh",
    doctorName: "Dr. Meera Gupta",
    medications: [
      { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", duration: "5 days" },
      { name: "Amoxicillin 250mg", dosage: "1 capsule three times daily", duration: "7 days" }
    ],
    date: "2025-04-15",
    status: "completed"
  },
  {
    id: 103,
    patientName: "Vikram Mehta",
    doctorName: "Dr. Suresh Kumar",
    medications: [
      { name: "Metformin 500mg", dosage: "1 tablet twice daily", duration: "30 days" }
    ],
    date: "2025-04-15",
    status: "completed"
  }
];

// Mock data for stats
const mockStats = {
  totalStock: 490,
  lowStock: 2,
  expiringThisMonth: 0,
  prescriptionsToday: 3
};

export default function PharmacyDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  
  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter medications based on search query
  const filteredMedications = mockMedications.filter((med) => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">
            Manage medication inventory and prescriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalStock} units</div>
            <p className="text-xs text-muted-foreground">Across {mockMedications.length} medications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.lowStock}</div>
            <p className="text-xs text-amber-500">Need to reorder soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.expiringThisMonth}</div>
            <p className="text-xs text-muted-foreground">Expires this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.prescriptionsToday}</div>
            <p className="text-xs text-muted-foreground">
              {mockPrescriptions.filter(p => p.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader className="space-y-0 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Medication Inventory</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search medications..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              Manage and monitor your stock levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground border-b pb-2">
                <div className="col-span-5">Medication</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-2">Expiry</div>
                <div className="col-span-1"></div>
              </div>
              
              {filteredMedications.map((med) => (
                <div key={med.id} className="grid grid-cols-12 items-center">
                  <div className="col-span-5 flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium text-sm">{med.name}</span>
                  </div>
                  <div className="col-span-2 text-sm">{med.category}</div>
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{med.stock}</span>
                      {med.stock <= med.threshold && (
                        <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">Low</Badge>
                      )}
                    </div>
                    <Progress 
                      value={(med.stock / (med.threshold * 4)) * 100}
                      className={`h-1 mt-1 ${med.stock <= med.threshold ? 'bg-amber-100 dark:bg-amber-900/30' : ''}`}
                    />
                  </div>
                  <div className="col-span-2 text-sm">
                    {new Date(med.expiry).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">Add New Medication</Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
            <CardDescription>
              Recent prescriptions to fulfill
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-4">
                {mockPrescriptions.filter(p => p.status === 'pending').map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{prescription.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{prescription.doctorName}</p>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      {prescription.medications.map((med, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {med.dosage} | {med.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Received: {new Date(prescription.date).toLocaleDateString()}</span>
                      <Button size="sm">Process</Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {mockPrescriptions.filter(p => p.status === 'completed').map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{prescription.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{prescription.doctorName}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      {prescription.medications.map((med, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {med.dosage} | {med.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Processed: {new Date(prescription.date).toLocaleDateString()}</span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
