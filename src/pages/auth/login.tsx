
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, ArrowRight, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Temporary account credentials
const tempAccounts = {
  patient: { email: "patient@healthsync.com", password: "patient123" },
  doctor: { email: "doctor@healthsync.com", password: "doctor123" },
  pharmacy: { email: "pharmacy@healthsync.com", password: "pharmacy123" },
  admin: { email: "admin@healthsync.com", password: "admin123" },
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userType, setUserType] = useState<string>("patient");
  const [showCredentials, setShowCredentials] = useState<boolean>(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple login validation for demo
    if (loginEmail === tempAccounts.patient.email && loginPassword === tempAccounts.patient.password) {
      handleSuccessfulLogin("patient");
    } else if (loginEmail === tempAccounts.doctor.email && loginPassword === tempAccounts.doctor.password) {
      handleSuccessfulLogin("doctor");
    } else if (loginEmail === tempAccounts.pharmacy.email && loginPassword === tempAccounts.pharmacy.password) {
      handleSuccessfulLogin("pharmacy");
    } else if (loginEmail === tempAccounts.admin.email && loginPassword === tempAccounts.admin.password) {
      handleSuccessfulLogin("admin");
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try using the test accounts.",
          variant: "destructive",
        });
      }, 1000);
    }
  };

  const handleSuccessfulLogin = (role: string) => {
    // Store user role in localStorage for persistence
    localStorage.setItem("healthsync_user_role", role);
    localStorage.setItem("healthsync_auth", "true");
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome to HealthSync ${role} dashboard!`,
      });
      navigate(`/${role}`);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Store registration info (in a real app this would go to a database)
      localStorage.setItem("healthsync_user_role", userType);
      localStorage.setItem("healthsync_auth", "true");
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      
      navigate(`/${userType}`);
    }, 1500);
  };

  const toggleCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-health-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Heart className="mr-2 h-6 w-6 fill-white" />
          HealthSync
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "HealthSync has streamlined our hospital operations and improved patient care coordination significantly."
            </p>
            <footer className="text-sm">Dr. Sharma, Apollo Hospitals</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-8 w-8 fill-health-primary stroke-white dark:stroke-black" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to HealthSync
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={toggleCredentials}
            >
              {showCredentials ? "Hide Test Accounts" : "Show Test Accounts"}
            </Button>
            
            {showCredentials && (
              <div className="mt-2 p-3 bg-muted rounded-md text-left text-xs">
                <h4 className="font-semibold mb-1">Test Accounts:</h4>
                <div className="grid gap-1">
                  <p>🧑‍⚕️ <strong>Patient:</strong> patient@healthsync.com / patient123</p>
                  <p>👨‍⚕️ <strong>Doctor:</strong> doctor@healthsync.com / doctor123</p>
                  <p>💊 <strong>Pharmacy:</strong> pharmacy@healthsync.com / pharmacy123</p>
                </div>
              </div>
            )}
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Login to your HealthSync account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          placeholder="m.sharma@example.com"
                          type="email"
                          className="pl-8"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-8"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button className="w-full" disabled={isLoading} type="submit">
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Sign In <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      <a href="#" className="text-primary underline-offset-4 hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card>
                <form onSubmit={handleRegister}>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Register a new HealthSync account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="firstName" 
                            placeholder="Mohan" 
                            className="pl-8"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Sharma" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="registerEmail"
                          placeholder="m.sharma@example.com"
                          type="email"
                          className="pl-8"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="registerPassword"
                          type="password"
                          className="pl-8"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userType">I am a</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <select 
                          id="userType"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-8 h-10"
                          value={userType}
                          onChange={(e) => setUserType(e.target.value)}
                          required
                        >
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="pharmacy">Pharmacy</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="terms" required />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the <a href="#" className="text-primary underline">terms of service</a> and <a href="#" className="text-primary underline">privacy policy</a>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={isLoading} type="submit">
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Create account <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
