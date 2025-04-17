
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  Tag,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicalRecord } from './index';

interface RecordDetailsProps {
  record: MedicalRecord;
  onUpdate: (updatedRecord: MedicalRecord) => void;
  onClose: () => void;
}

export function RecordDetails({ record, onUpdate, onClose }: RecordDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(record.notes || '');
  const [tags, setTags] = useState(record.tags?.join(', ') || '');
  
  const handleSaveChanges = () => {
    const updatedRecord = {
      ...record,
      notes: notes,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };
    onUpdate(updatedRecord);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden bg-muted/30">
        <div className="h-[400px] relative flex items-center justify-center bg-muted">
          {record.format === 'image' ? (
            <img 
              src={record.fileUrl || '/placeholder.svg'} 
              alt={record.title} 
              className="max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-2" />
              <h3 className="font-medium">{record.title}</h3>
              <p className="text-sm text-muted-foreground">{record.format.toUpperCase()} Document</p>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="notes">Notes & Tags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 py-4">
            <h2 className="text-xl font-bold">{record.title}</h2>
            <p>{record.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Date: {new Date(record.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Doctor: {record.doctor}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>Department: {record.department}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Type: {record.type.charAt(0).toUpperCase() + record.type.slice(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Add notes about this record"
                  className="mt-1"
                  rows={5}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input 
                  value={tags} 
                  onChange={(e) => setTags(e.target.value)} 
                  placeholder="Enter tags separated by commas"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setNotes(record.notes || '');
                  setTags(record.tags?.join(', ') || '');
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-md font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md min-h-[100px]">
                  {record.notes || 'No notes available for this record.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {record.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {(!record.tags || record.tags.length === 0) && (
                    <p className="text-sm text-muted-foreground">No tags available for this record.</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Notes & Tags
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
