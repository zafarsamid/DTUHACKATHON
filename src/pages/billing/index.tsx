
import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock, 
  X, 
  ChevronDown,
  Calendar,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Mock data for bills
const mockBills = [
  {
    id: "INV-20250412-001",
    date: "2025-04-12",
    amount: 250.00,
    description: "General Checkup",
    status: "paid",
    paymentDate: "2025-04-12",
    paymentMethod: "Credit Card",
    items: [
      { name: "Consultation Fee", amount: 200.00 },
      { name: "Blood Pressure Check", amount: 25.00 },
      { name: "Temperature Check", amount: 25.00 }
    ]
  },
  {
    id: "INV-20250405-002",
    date: "2025-04-05",
    amount: 1200.00,
    description: "Cardiology Consultation & ECG",
    status: "pending",
    dueDate: "2025-04-19",
    items: [
      { name: "Specialist Consultation", amount: 500.00 },
      { name: "ECG", amount: 400.00 },
      { name: "Blood Test", amount: 300.00 }
    ]
  },
  {
    id: "INV-20250320-003",
    date: "2025-03-20",
    amount: 750.00,
    description: "X-ray & Analysis",
    status: "paid",
    paymentDate: "2025-03-20",
    paymentMethod: "Insurance",
    items: [
      { name: "X-ray", amount: 500.00 },
      { name: "Radiologist Report", amount: 250.00 }
    ]
  },
  {
    id: "INV-20250310-004",
    date: "2025-03-10",
    amount: 1500.00,
    description: "Dental Procedure",
    status: "overdue",
    dueDate: "2025-03-24",
    items: [
      { name: "Dental Surgery", amount: 1000.00 },
      { name: "Medication", amount: 300.00 },
      { name: "Follow-up Visit", amount: 200.00 }
    ]
  }
];

export default function BillingPage() {
  const [bills, setBills] = useState(mockBills);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = bills.filter(bill => 
    bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDownload = (id: string) => {
    toast.success(`Invoice ${id} downloaded successfully`);
  };
  
  const handlePayment = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id ? { 
        ...bill, 
        status: 'paid', 
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card'
      } : bill
    ));
    toast.success(`Payment for invoice ${id} completed successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <p className="text-muted-foreground text-sm">Total Due</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${bills.filter(b => b.status === 'pending' || b.status === 'overdue').reduce((acc, bill) => acc + bill.amount, 0).toFixed(2)}</p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
              <p className="text-muted-foreground text-sm">Paid (Last 30 Days)</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${bills.filter(b => b.status === 'paid').reduce((acc, bill) => acc + bill.amount, 0).toFixed(2)}</p>
            </div>
            <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <p className="text-muted-foreground text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">${bills.filter(b => b.status === 'overdue').reduce((acc, bill) => acc + bill.amount, 0).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        {['all', 'paid', 'pending', 'overdue'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filteredBills
              .filter(bill => tab === 'all' || bill.status === tab)
              .map(bill => (
                <InvoiceCard 
                  key={bill.id} 
                  bill={bill} 
                  onDownload={() => handleDownload(bill.id)} 
                  onPay={() => handlePayment(bill.id)} 
                />
              ))}
              
            {filteredBills.filter(bill => tab === 'all' || bill.status === tab).length === 0 && (
              <EmptyState message={`No ${tab === 'all' ? '' : tab} invoices found`} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

type InvoiceCardProps = {
  bill: any;
  onDownload: () => void;
  onPay: () => void;
};

const InvoiceCard = ({ bill, onDownload, onPay }: InvoiceCardProps) => {
  return (
    <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
      <AccordionItem value={bill.id} className="border-0">
        <AccordionTrigger className="px-4 py-4 hover:no-underline">
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="font-medium">{bill.id}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(bill.date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <div className="font-medium">${bill.amount.toFixed(2)}</div>
              {bill.status === 'paid' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
              )}
              {bill.status === 'pending' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
              )}
              {bill.status === 'overdue' && (
                <Badge variant="destructive">Overdue</Badge>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-0">
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">{bill.description}</h4>
            
            <div className="bg-muted/50 p-3 rounded-md mb-4">
              <div className="font-medium mb-2 text-sm">Line Items</div>
              <div className="space-y-2">
                {bill.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${bill.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {bill.status === 'paid' && (
              <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                <CheckCircle className="h-4 w-4" />
                <span>Paid on {new Date(bill.paymentDate).toLocaleDateString()} via {bill.paymentMethod}</span>
              </div>
            )}
            
            {(bill.status === 'pending' || bill.status === 'overdue') && (
              <div className="flex items-center gap-2 text-sm mb-4">
                <Clock className="h-4 w-4" />
                <span>Due on {new Date(bill.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-2">
              <Button variant="outline" className="flex-1" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
              
              {(bill.status === 'pending' || bill.status === 'overdue') && (
                <Button className="flex-1" size="sm" onClick={onPay}>
                  <CreditCard className="h-4 w-4 mr-2" /> Pay Now
                </Button>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
    <h3 className="text-lg font-medium">{message}</h3>
    <p className="text-muted-foreground mt-1">No invoices match your criteria</p>
  </div>
);
