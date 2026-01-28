import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Phone, MessageSquare, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';
import { validateInquiryForm } from '@/utils/ValidationUtils';
import { exportInquiriesToCSV } from '@/utils/ExportUtils';

const InquiryManagement = ({ data }) => {
  const { inquiries, addInquiry, updateInquiry, deleteInquiry, convertInquiryToMember, plans } = data;
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [formData, setFormData] = useState({});
  const [convertPlanId, setConvertPlanId] = useState('');
  const [errors, setErrors] = useState({});

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (inquiry = null) => {
    if (inquiry) {
      setFormData(inquiry);
      setSelectedInquiry(inquiry);
    } else {
      setFormData({
        name: '', email: '', phone: '', inquiryType: 'membership', message: '', source: 'walk-in', status: 'new'
      });
      setSelectedInquiry(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateInquiryForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (selectedInquiry) {
      updateInquiry(selectedInquiry.id, formData);
      toast({ title: 'Success', description: 'Inquiry updated' });
    } else {
      addInquiry(formData);
      toast({ title: 'Success', description: 'Inquiry added' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedInquiry) {
      deleteInquiry(selectedInquiry.id);
      toast({ title: 'Success', description: 'Inquiry deleted' });
      setIsDeleteOpen(false);
      setSelectedInquiry(null);
    }
  };

  const handleConvert = () => {
    if (selectedInquiry && convertPlanId) {
      convertInquiryToMember(selectedInquiry, convertPlanId);
      toast({ title: 'Success', description: 'Inquiry converted to member!' });
      setIsConvertOpen(false);
      setSelectedInquiry(null);
      setConvertPlanId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
               placeholder="Search inquiries..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <select 
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => exportInquiriesToCSV(filteredInquiries)}>Export CSV</Button>
           <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Inquiry</Button>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <Table>
          <TableHeader>
             <TableRow className="border-slate-800">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Contact</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
             </TableRow>
          </TableHeader>
          <TableBody>
             {filteredInquiries.map(inquiry => (
               <TableRow key={inquiry.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-white font-medium">{inquiry.name}</TableCell>
                  <TableCell>
                     <div className="flex flex-col text-xs">
                        <span className="text-slate-300">{inquiry.email}</span>
                        <span className="text-slate-500">{inquiry.phone}</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-slate-300 capitalize">{inquiry.inquiryType}</TableCell>
                  <TableCell>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        inquiry.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                        inquiry.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                        inquiry.status === 'converted' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                     }`}>
                        {inquiry.status}
                     </span>
                  </TableCell>
                  <TableCell className="text-slate-300">{inquiry.inquiryDate}</TableCell>
                  <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                        {inquiry.status !== 'converted' && (
                           <Button variant="ghost" size="icon" onClick={() => { setSelectedInquiry(inquiry); setIsConvertOpen(true); }}>
                              <UserPlus className="w-4 h-4 text-slate-400 hover:text-green-400" />
                           </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(inquiry)}>
                           <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedInquiry(inquiry); setIsDeleteOpen(true); }}>
                           <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                        </Button>
                     </div>
                  </TableCell>
               </TableRow>
             ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedInquiry ? 'Edit Inquiry' : 'Add Inquiry'}>
         <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} error={errors.name} required />
            <div className="grid grid-cols-2 gap-4">
               <FormInput label="Email" type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} error={errors.email} required />
               <FormInput label="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} error={errors.phone} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <FormSelect label="Type" value={formData.inquiryType || 'membership'} onChange={e => setFormData({...formData, inquiryType: e.target.value})} options={[{label:'Membership', value:'membership'}, {label:'Training', value:'training'}, {label:'Other', value:'other'}]} error={errors.inquiryType} />
               <FormSelect label="Source" value={formData.source || 'walk-in'} onChange={e => setFormData({...formData, source: e.target.value})} options={[{label:'Walk-in', value:'walk-in'}, {label:'Website', value:'website'}, {label:'Referral', value:'referral'}]} />
            </div>
            <FormTextarea label="Message" value={formData.message || ''} onChange={e => setFormData({...formData, message: e.target.value})} />
            <div className="flex justify-end gap-3 mt-6">
               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </div>
         </form>
      </Modal>

      <Modal isOpen={isConvertOpen} onClose={() => setIsConvertOpen(false)} title="Convert to Member">
         <div className="space-y-4">
            <p className="text-slate-300">Select a membership plan for <strong>{selectedInquiry?.name}</strong>:</p>
            <FormSelect 
               label="Membership Plan"
               value={convertPlanId}
               onChange={e => setConvertPlanId(e.target.value)}
               options={plans.map(p => ({ label: p.name, value: p.id }))}
               required
            />
            <div className="flex justify-end gap-3 mt-6">
               <Button variant="outline" onClick={() => setIsConvertOpen(false)}>Cancel</Button>
               <Button onClick={handleConvert} className="bg-green-600 hover:bg-green-700" disabled={!convertPlanId}>Convert</Button>
            </div>
         </div>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Inquiry" message="Are you sure you want to delete this inquiry?" />
    </div>
  );
};

export default InquiryManagement;