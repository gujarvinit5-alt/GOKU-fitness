import React, { useState } from 'react';
import { Plus, Search, Download, FileDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormInput, FormSelect } from '@/components/ui/form-input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { validatePaymentForm } from '@/utils/ValidationUtils';

const BillingPayment = ({ data }) => {
  const { payments, members, addPayment, updatePayment } = data; // Added updatePayment
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const filteredPayments = payments.filter(p => {
     const member = members.find(m => m.id === p.memberId);
     const matchSearch = member?.name.toLowerCase().includes(searchTerm.toLowerCase());
     const matchStatus = filterStatus === 'all' || p.status === filterStatus;
     return matchSearch && matchStatus;
  });

  const handleOpenModal = () => {
    setFormData({
      memberId: '', amount: '', paymentMethod: 'cash', paymentDate: new Date().toISOString().split('T')[0], status: 'paid'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(validatePaymentForm(formData)) {
       addPayment(formData);
       setIsModalOpen(false);
       toast({title: 'Success', description: 'Payment recorded'});
    }
  };

  // --- NEW: Toggle Status Function ---
  const toggleStatus = (paymentId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    // This assumes you have an updatePayment function in your useGymData hook. 
    // If not, we can just mock it for UI for now, but updatePayment is better.
    if (updatePayment) {
        updatePayment(paymentId, { status: newStatus });
        toast({ title: "Updated", description: `Marked as ${newStatus}` });
    } else {
        console.warn("updatePayment function missing from props");
    }
  };

  // --- NEW: Export CSV Function ---
  const handleExport = () => {
    const headers = ['Invoice', 'Member Name', 'Date', 'Amount', 'Status', 'Method'];
    const rows = filteredPayments.map(p => {
        const m = members.find(mem => mem.id === p.memberId);
        return [
            p.invoiceNumber,
            m ? m.name : 'Unknown',
            p.paymentDate,
            p.amount,
            p.status,
            p.paymentMethod
        ];
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
         <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border-none shadow-sm focus:ring-2 focus:ring-[#FF6B35]"
                 placeholder="Search payments..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            <select 
               className="bg-white border-none rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FF6B35]"
               value={filterStatus}
               onChange={e => setFilterStatus(e.target.value)}
            >
               <option value="all">All Status</option>
               <option value="paid">Paid</option>
               <option value="pending">Pending</option>
               <option value="overdue">Overdue</option>
            </select>
         </div>
         <div className="flex gap-2">
             <Button variant="outline" onClick={handleExport} className="bg-white text-slate-700 hover:bg-slate-50">
                <FileDown className="w-4 h-4 mr-2" /> Export CSV
             </Button>
             <Button onClick={handleOpenModal} className="bg-[#FF6B35] hover:bg-[#E85D2E] text-white">
                <Plus className="w-4 h-4 mr-2" /> New Payment
             </Button>
         </div>
      </div>

      <Card className="border-none shadow-lg bg-white overflow-hidden">
         <Table>
            <TableHeader>
               <TableRow className="bg-slate-50 border-none">
                  <TableHead className="font-bold text-[#1A1A1A]">Invoice</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A]">Member</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A]">Date</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A]">Amount</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A]">Status</TableHead>
                  <TableHead className="text-right font-bold text-[#1A1A1A]">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {filteredPayments.map(payment => {
                  const member = members.find(m => m.id === payment.memberId);
                  return (
                     <TableRow key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <TableCell className="font-mono text-slate-500">{payment.invoiceNumber}</TableCell>
                        <TableCell className="font-bold text-[#1A1A1A]">{member?.name}</TableCell>
                        <TableCell className="text-slate-600">{payment.paymentDate}</TableCell>
                        <TableCell className="font-bold text-[#1A1A1A]">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                        <TableCell>
                           {/* Clickable Badge to Toggle Status */}
                           <span 
                             onClick={() => toggleStatus(payment.id, payment.status)}
                             className={`px-2 py-1 rounded-md text-xs font-bold uppercase cursor-pointer select-none transition-opacity hover:opacity-80 ${
                               payment.status === 'paid' ? 'bg-green-100 text-green-700' : 
                               payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                               'bg-red-100 text-red-700'
                             }`}
                           >
                              {payment.status}
                           </span>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#FF6B35]">
                              <Download className="w-4 h-4" />
                           </Button>
                        </TableCell>
                     </TableRow>
                  );
               })}
            </TableBody>
         </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Payment">
         <form onSubmit={handleSubmit} className="space-y-4">
             <FormSelect 
               label="Member" 
               value={formData.memberId} 
               onChange={e => setFormData({...formData, memberId: e.target.value})} 
               options={members.map(m => ({label: m.name, value: m.id}))}
               required 
             />
             <div className="grid grid-cols-2 gap-4">
                <FormInput label="Amount" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                <FormInput label="Date" type="date" value={formData.paymentDate} onChange={e => setFormData({...formData, paymentDate: e.target.value})} required />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Method" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} options={[{label:'Cash', value:'cash'}, {label:'Card', value:'card'}, {label:'Online', value:'online'}]} />
                <FormSelect label="Status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} options={[{label:'Paid', value:'paid'}, {label:'Pending', value:'pending'}]} />
             </div>
             <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#FF6B35] text-white hover:bg-[#E85D2E]">Save</Button>
             </div>
         </form>
      </Modal>
    </div>
  );
};

export default BillingPayment;