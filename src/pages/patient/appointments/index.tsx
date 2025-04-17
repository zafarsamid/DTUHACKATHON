
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  X, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    doctor: {
      name: "Dr. Patel",
      specialty: "Cardiologist",
      avatar: null,
    },
    date: "2025-04-20",
    time: "10:30 AM",
    location: "Main Hospital, Room 205",
    type: "In-person",
    status: "upcoming"
  },
  {
    id: 2,
    doctor: {
      name: "Dr. Singh",
      specialty: "General Physician",
      avatar: null,
    },
    date: "2025-04-28",
    time: "2:00 PM",
    location: "Online",
    type: "Video",
    status: "upcoming"
  },
  {
    id: 3,
    doctor: {
      name: "Dr. Sharma",
      specialty: "Dermatologist",
      avatar: null,
    },
    date: "2025-03-15",
    time: "3:30 PM",
    location: "Main Hospital, Room 112",
    type: "In-person",
    status: "completed"
  },
  {
    id: 4,
    doctor: {
      name: "Dr. Gupta",
      specialty: "Neurologist",
      avatar: null,
    },
    date: "2025-03-05",
    time: "11:00 AM",
    location: "Online",
    type: "Phone",
    status: "cancelled",
    cancelReason: "Doctor unavailable"
  }
];

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState(mockAppointments);

  const cancelAppointment = (id: number) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: 'cancelled', cancelReason: 'Patient cancelled' } : appointment
    ));
    toast.success("Appointment cancelled successfully");
  };

  const rescheduleAppointment = (id: number) => {
    toast.info("Rescheduling functionality will be implemented soon");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Book New Appointment</span>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {appointments.filter(app => app.status === 'upcoming').length > 0 ? (
            appointments
              .filter(app => app.status === 'upcoming')
              .map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onCancel={() => cancelAppointment(appointment.id)} 
                  onReschedule={() => rescheduleAppointment(appointment.id)} 
                />
              ))
          ) : (
            <EmptyState message="No upcoming appointments" />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {appointments.filter(app => app.status === 'completed').length > 0 ? (
            appointments
              .filter(app => app.status === 'completed')
              .map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  isPast 
                />
              ))
          ) : (
            <EmptyState message="No past appointments" />
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {appointments.filter(app => app.status === 'cancelled').length > 0 ? (
            appointments
              .filter(app => app.status === 'cancelled')
              .map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  isPast 
                  isCancelled 
                />
              ))
          ) : (
            <EmptyState message="No cancelled appointments" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

type AppointmentCardProps = {
  appointment: any;
  onCancel?: () => void;
  onReschedule?: () => void;
  isPast?: boolean;
  isCancelled?: boolean;
};

const AppointmentCard = ({ 
  appointment, 
  onCancel, 
  onReschedule, 
  isPast = false, 
  isCancelled = false 
}: AppointmentCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={appointment.doctor.avatar || ""} alt={appointment.doctor.name} />
            <AvatarFallback>{appointment.doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{appointment.doctor.name}</CardTitle>
            <CardDescription>{appointment.doctor.specialty}</CardDescription>
          </div>
        </div>
        
        {isCancelled ? (
          <Badge variant="destructive" className="ml-auto">Cancelled</Badge>
        ) : isPast ? (
          <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">Completed</Badge>
        ) : (
          <Badge className="ml-auto">Upcoming</Badge>
        )}
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(appointment.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{appointment.time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {appointment.type === "Video" ? (
              <Video className="h-5 w-5 text-muted-foreground" />
            ) : appointment.type === "Phone" ? (
              <Phone className="h-5 w-5 text-muted-foreground" />
            ) : (
              <MapPin className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{appointment.location}</p>
            </div>
          </div>
          
          {isCancelled && appointment.cancelReason && (
            <div className="flex items-center gap-3 col-span-full">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cancellation Reason</p>
                <p className="font-medium text-red-600">{appointment.cancelReason}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {!isPast && !isCancelled && (
        <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
          <Button variant="outline" className="flex-1" onClick={onReschedule}>
            Reschedule
          </Button>
          <Button variant="ghost" className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={onCancel}>
            Cancel
          </Button>
          {appointment.type !== "In-person" && (
            <Button className="w-full mt-2">
              {appointment.type === "Video" ? "Join Video Call" : "Join Phone Call"}
            </Button>
          )}
        </CardFooter>
      )}
      
      {isPast && !isCancelled && (
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Book Follow-up
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Calendar className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
    <h3 className="text-lg font-medium">{message}</h3>
    <p className="text-muted-foreground mt-1">Your scheduled appointments will appear here</p>
    <Button className="mt-6">Book an Appointment</Button>
  </div>
);
