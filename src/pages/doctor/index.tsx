
import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  FileText,
  User
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    patient: {
      name: "Amit Sharma",
      age: 45,
      avatar: null,
    },
    time: "09:00 AM",
    type: "Follow-up",
    status: "confirmed"
  },
  {
    id: 2,
    patient: {
      name: "Priya Patel",
      age: 32,
      avatar: null,
    },
    time: "10:30 AM",
    type: "New Consultation",
    status: "confirmed"
  },
  {
    id: 3,
    patient: {
      name: "Rahul Gupta",
      age: 58,
      avatar: null,
    },
    time: "11:45 AM",
    type: "Lab Results Review",
    status: "pending"
  },
  {
    id: 4,
    patient: {
      name: "Meena Singh",
      age: 29,
      avatar: null,
    },
    time: "02:15 PM",
    type: "Follow-up",
    status: "confirmed"
  }
];

// Mock data for recent patients
const mockRecentPatients = [
  {
    id: 101,
    name: "Ravi Kumar",
    age: 52,
    lastVisit: "2025-04-14",
    condition: "Hypertension",
    avatar: null
  },
  {
    id: 102,
    name: "Anjali Sharma",
    age: 36,
    lastVisit: "2025-04-13",
    condition: "Diabetes Type 2",
    avatar: null
  },
  {
    id: 103,
    name: "Vijay Mehta",
    age: 61,
    lastVisit: "2025-04-10",
    condition: "Arthritis",
    avatar: null
  }
];

// Mock data for stats
const mockStats = {
  totalPatients: 128,
  appointmentsToday: 8,
  pendingReports: 3,
  newPatients: 5
};

export default function DoctorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  
  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Sharma. Here's your schedule for today.
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
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">2 more than yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Need your attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.newPatients}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              You have {mockAppointments.length} appointments today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 border mr-3">
                      <AvatarImage src={appointment.patient.avatar || ''} alt={appointment.patient.name} />
                      <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{appointment.patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.type} | Age: {appointment.patient.age}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant={appointment.status === 'confirmed' ? 'default' : 'outline'}
                      className="mr-3"
                    >
                      {appointment.time}
                    </Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Patients</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {mockRecentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 border mr-3">
                        <AvatarImage src={patient.avatar || ''} alt={patient.name} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Age: {patient.age} | {patient.condition}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0">
                      <FileText className="h-4 w-4 mr-1" />
                      Records
                    </Button>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="recent" className="space-y-4">
                {mockRecentPatients.slice(0, 2).map((patient) => (
                  <div key={patient.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 border mr-3">
                        <AvatarImage src={patient.avatar || ''} alt={patient.name} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Age: {patient.age} | {patient.condition}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0">
                      <FileText className="h-4 w-4 mr-1" />
                      Records
                    </Button>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="critical">
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <AlertCircle className="h-10 w-10 mb-2" />
                  <p>No critical patients right now.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
