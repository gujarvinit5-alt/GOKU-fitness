import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Download, Filter, Receipt, Calendar, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV } from '@/utils/ExportUtils';

const ExpenseManagement = () => {
  const { toast } = useToast();
  // Local state management since useGymData access is restricted for writing
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('gym_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('gym_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const categories = ['Equipment', 'Maintenance', 'Utilities', 'Staff', 'Marketing', 'Other'];

  const handleOpenModal = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'Other',
      amount: '',
      description: '',
      vendor: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount)
    };
    setExpenses([newExpense, ...expenses]);
    setIsModalOpen(false);
    toast({ title: 'Success', description: 'Expense recorded successfully' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id));
      toast({ title: 'Deleted', description: 'Expense removed' });
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#1A1A1A] to-[#2C3E50] text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Expenses</p>
                <h3 className="text-3xl font-bold">${totalExpenses.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-[#FF6B35]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Category Summary */}
        <Card className="border-none shadow-lg bg-white">
          <CardContent className="pt-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Top Categories</h4>
            <div className="space-y-3">
              {categories.slice(0, 3).map(cat => {
                const amount = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                return (
                  <div key={cat} className="flex justify-between text-sm">
                    <span className="text-[#1A1A1A]">{cat}</span>
                    <span className="font-bold text-[#FF6B35]">${amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex gap-2 items-center flex-1">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B35]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-slate-50 border-none text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B35]"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToCSV(expenses, 'expenses')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={handleOpenModal} className="bg-[#FF6B35] hover:bg-[#E85D2E] text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Expense
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border-none shadow-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-100">
              <TableHead className="text-[#1A1A1A] font-bold">Date</TableHead>
              <TableHead className="text-[#1A1A1A] font-bold">Description</TableHead>
              <TableHead className="text-[#1A1A1A] font-bold">Category</TableHead>
              <TableHead className="text-[#1A1A1A] font-bold">Vendor</TableHead>
              <TableHead className="text-[#1A1A1A] font-bold text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-slate-50/50 border-slate-100">
                <TableCell className="font-medium text-slate-600">{expense.date}</TableCell>
                <TableCell className="font-semibold text-[#1A1A1A]">{expense.description}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md text-xs font-bold bg-orange-100 text-[#FF6B35] uppercase">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{expense.vendor}</TableCell>
                <TableCell className="text-right font-bold text-[#1A1A1A]">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} className="hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredExpenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            <FormInput label="Amount ($)" type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} options={categories.map(c => ({label: c, value: c}))} required />
            <FormInput label="Vendor" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} />
          </div>
          <FormTextarea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E85D2E] text-white">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpenseManagement;