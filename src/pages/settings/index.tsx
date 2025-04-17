
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Phone, 
  Mail, 
  Home, 
  Calendar, 
  Save,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, India',
    dateOfBirth: '1988-06-15'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    appointments: true,
    medicationReminders: true,
    updates: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30'
  });

  const [privacy, setPrivacy] = useState({
    shareData: false,
    useDataForResearch: true,
    allowLocationAccess: false
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = () => {
    toast.success('Personal information updated successfully');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success(`Notification preferences updated`);
  };

  const handleSecurityChange = (key: string, value: string | boolean) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
    toast.success('Security settings updated');
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success('Privacy preferences updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={personalInfo.name} 
                    onChange={handlePersonalInfoChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={personalInfo.email} 
                    onChange={handlePersonalInfoChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={personalInfo.phone} 
                    onChange={handlePersonalInfoChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    name="dateOfBirth"
                    type="date" 
                    value={personalInfo.dateOfBirth} 
                    onChange={handlePersonalInfoChange} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={personalInfo.address} 
                    onChange={handlePersonalInfoChange} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" onClick={handleSavePersonalInfo}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Channels</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
                  </div>
                  <Switch 
                    id="appointment-reminders" 
                    checked={notifications.appointments}
                    onCheckedChange={(checked) => handleNotificationChange('appointments', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="medication-reminders">Medication Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to take your medications</p>
                  </div>
                  <Switch 
                    id="medication-reminders" 
                    checked={notifications.medicationReminders}
                    onCheckedChange={(checked) => handleNotificationChange('medicationReminders', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="updates-announcements">Updates & Announcements</Label>
                    <p className="text-sm text-muted-foreground">Receive news and updates from HealthSync</p>
                  </div>
                  <Switch 
                    id="updates-announcements" 
                    checked={notifications.updates}
                    onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    id="two-factor-auth" 
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="session-timeout" 
                      type="number"
                      min="5" 
                      max="60"
                      className="max-w-[100px]"
                      value={security.sessionTimeout} 
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleSecurityChange('sessionTimeout', '30')}>Reset</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Auto logout after period of inactivity</p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Password</Label>
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" /> Privacy Preferences
              </CardTitle>
              <CardDescription>
                Control how your data is used.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-data">Share Medical Data with Providers</Label>
                    <p className="text-sm text-muted-foreground">Allow your medical data to be shared with your healthcare providers</p>
                  </div>
                  <Switch 
                    id="share-data" 
                    checked={privacy.shareData}
                    onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-research">Allow Anonymous Data for Research</Label>
                    <p className="text-sm text-muted-foreground">Contribute anonymized data to medical research</p>
                  </div>
                  <Switch 
                    id="data-research" 
                    checked={privacy.useDataForResearch}
                    onCheckedChange={(checked) => handlePrivacyChange('useDataForResearch', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-access">Location Services</Label>
                    <p className="text-sm text-muted-foreground">Allow access to your location for nearby healthcare services</p>
                  </div>
                  <Switch 
                    id="location-access" 
                    checked={privacy.allowLocationAccess}
                    onCheckedChange={(checked) => handlePrivacyChange('allowLocationAccess', checked)}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    Request Data Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
