
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MedicalRecord } from './index';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.enum(['report', 'prescription', 'scan', 'lab']),
  format: z.enum(['pdf', 'image', 'doc']),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  doctor: z.string().min(2, {
    message: "Doctor name must be at least 2 characters.",
  }),
  date: z.string(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

type UploadRecordFormProps = {
  onSubmit: (record: MedicalRecord) => void;
  onCancel: () => void;
};

export function UploadRecordForm({ onSubmit, onCancel }: UploadRecordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'report',
      format: 'pdf',
      department: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      tags: '',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const tagArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
    
    onSubmit({
      id: 0, // ID will be assigned by the parent component
      title: values.title,
      description: values.description,
      type: values.type,
      format: values.format,
      department: values.department,
      doctor: values.doctor,
      date: values.date,
      fileUrl: '/placeholder.pdf', // In a real app, this would be the uploaded file URL
      notes: values.notes,
      tags: tagArray.length > 0 ? tagArray : undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter record title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter record description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="scan">Scan</SelectItem>
                    <SelectItem value="lab">Lab Result</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Enter department" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>
                <FormControl>
                  <Input placeholder="Enter doctor's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Record Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter tags separated by commas" {...field} />
              </FormControl>
              <FormDescription>
                E.g., xray, cardiology, annual
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Upload Record</Button>
        </div>
      </form>
    </Form>
  );
}
