
import React, { useState } from 'react';
import { 
  FileText, 
  Filter, 
  UploadCloud, 
  Download, 
  Trash2, 
  PenLine, 
  Printer, 
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UploadRecordForm } from './upload-record-form';
import { RecordDetails } from './record-details';
import { mockMedicalRecords } from './mock-data';

export interface MedicalRecord {
  id: number;
  title: string;
  description: string;
  type: 'report' | 'prescription' | 'scan' | 'lab';
  format: 'pdf' | 'image' | 'doc';
  department: string;
  doctor: string;
  date: string;
  fileUrl: string;
  notes?: string;
  tags?: string[];
}

const PatientRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showRecordDetailsDialog, setShowRecordDetailsDialog] = useState(false);
  
  // Filter records based on search and filters
  const filteredRecords = records.filter(record => {
    return (
      (record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterDepartment === 'all' || record.department === filterDepartment) &&
      (filterDoctor === 'all' || record.doctor === filterDoctor)
    );
  });
  
  const departments = Array.from(new Set(records.map(record => record.department)));
  const doctors = Array.from(new Set(records.map(record => record.doctor)));
  
  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowRecordDetailsDialog(true);
  };
  
  const handleDownloadRecord = (record: MedicalRecord) => {
    // In a real app, this would download the file
    alert(`Downloading ${record.title}`);
  };
  
  const handleDeleteRecord = (recordId: number) => {
    const updatedRecords = records.filter(record => record.id !== recordId);
    setRecords(updatedRecords);
  };
  
  const handleAddRecord = (newRecord: MedicalRecord) => {
    setRecords([...records, { ...newRecord, id: records.length + 1 }]);
    setShowUploadDialog(false);
  };

  const handleUpdateRecord = (updatedRecord: MedicalRecord) => {
    const updatedRecords = records.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );
    setRecords(updatedRecords);
    setShowRecordDetailsDialog(false);
  };

  const getIconForRecordType = (type: string) => {
    switch(type) {
      case 'report': return <FileText className="h-8 w-8 text-blue-500" />;
      case 'prescription': return <FileText className="h-8 w-8 text-green-500" />;
      case 'scan': return <FileText className="h-8 w-8 text-purple-500" />;
      case 'lab': return <FileText className="h-8 w-8 text-amber-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getIconForFormat = (format: string) => {
    switch(format) {
      case 'pdf': return 'PDF';
      case 'image': return 'IMG';
      case 'doc': return 'DOC';
      default: return 'FILE';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
              <DialogDescription>
                Upload your medical documents, reports, or prescriptions.
              </DialogDescription>
            </DialogHeader>
            <UploadRecordForm onSubmit={handleAddRecord} onCancel={() => setShowUploadDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row items-start sm:items-center">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterDoctor} onValueChange={setFilterDoctor}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map(doc => (
                <SelectItem key={doc} value={doc}>{doc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="scans">Scans</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No records found</h3>
              <p className="text-muted-foreground">
                Upload a new medical record or adjust your search filters.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{record.title}</CardTitle>
                      <CardDescription>{new Date(record.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {getIconForFormat(record.format)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 flex items-center gap-3">
                    {getIconForRecordType(record.type)}
                    <div className="flex-1">
                      <p className="text-sm line-clamp-2">{record.description}</p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="secondary">{record.department}</Badge>
                        <Badge variant="outline">{record.doctor}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadRecord(record)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <PenLine className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-md">
              {filteredRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-4">
                    {getIconForRecordType(record.type)}
                    <div>
                      <h3 className="font-medium">{record.title}</h3>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{record.doctor}</span>
                        <span>•</span>
                        <span>{record.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>View</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadRecord(record)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="p-4 text-center text-muted-foreground">
            <p>Filter to show only medical reports</p>
          </div>
        </TabsContent>
        
        <TabsContent value="prescriptions">
          <div className="p-4 text-center text-muted-foreground">
            <p>Filter to show only prescriptions</p>
          </div>
        </TabsContent>
        
        <TabsContent value="scans">
          <div className="p-4 text-center text-muted-foreground">
            <p>Filter to show only scan results</p>
          </div>
        </TabsContent>
        
        <TabsContent value="lab">
          <div className="p-4 text-center text-muted-foreground">
            <p>Filter to show only lab results</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Record Details Dialog */}
      {selectedRecord && (
        <Dialog open={showRecordDetailsDialog} onOpenChange={setShowRecordDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Record Details</DialogTitle>
            </DialogHeader>
            <RecordDetails 
              record={selectedRecord} 
              onUpdate={handleUpdateRecord}
              onClose={() => setShowRecordDetailsDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientRecords;
