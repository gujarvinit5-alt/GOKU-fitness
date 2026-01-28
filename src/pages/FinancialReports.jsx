import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, BarChart, LineChart } from '@/components/ChartComponents';
import { exportFinancialReportToCSV } from '@/utils/ExportUtils';
import { DollarSign, TrendingDown, TrendingUp, PieChart as PieIcon } from 'lucide-react';

const FinancialReports = ({ data }) => {
  const { payments, expenses, plans } = data;
  const [dateRange, setDateRange] = useState('year'); // month, quarter, year

  // Helper to filter data by date range
  const filterByDate = (items, dateField) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      if (dateRange === 'year') return itemDate.getFullYear() === currentYear;
      if (dateRange === 'month') return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      if (dateRange === 'quarter') {
         const q = Math.floor(currentMonth / 3);
         const itemQ = Math.floor(itemDate.getMonth() / 3);
         return q === itemQ && itemDate.getFullYear() === currentYear;
      }
      return true;
    });
  };

  const filteredPayments = filterByDate(payments.filter(p => p.status === 'paid'), 'paymentDate');
  const filteredExpenses = filterByDate(expenses, 'date');

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Chart Data Preparation
  const revenueByPlan = {
    labels: plans.map(p => p.name),
    datasets: [{
      data: plans.map(plan => 
        filteredPayments.filter(p => p.planId === plan.id).reduce((sum, p) => sum + parseFloat(p.amount), 0)
      ),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
      borderWidth: 0
    }]
  };

  const expensesByCategory = {
    labels: [...new Set(filteredExpenses.map(e => e.category))],
    datasets: [{
      label: 'Expenses by Category',
      data: [...new Set(filteredExpenses.map(e => e.category))].map(cat => 
        filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + parseFloat(e.amount), 0)
      ),
      backgroundColor: '#ef4444'
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {['month', 'quarter', 'year'].map(range => (
            <Button 
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              onClick={() => setDateRange(range)}
              className="capitalize"
            >
              This {range}
            </Button>
          ))}
        </div>
        <Button variant="outline" onClick={() => exportFinancialReportToCSV([...filteredPayments, ...filteredExpenses])}>
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
               <p className="text-slate-400 text-sm">Total Revenue</p>
               <h3 className="text-2xl font-bold text-green-400">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg"><DollarSign className="w-5 h-5 text-green-400" /></div>
          </div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
               <p className="text-slate-400 text-sm">Total Expenses</p>
               <h3 className="text-2xl font-bold text-red-400">${totalExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-red-500/20 rounded-lg"><TrendingDown className="w-5 h-5 text-red-400" /></div>
          </div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
               <p className="text-slate-400 text-sm">Net Profit</p>
               <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                 ${netProfit.toFixed(2)}
               </h3>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-400" /></div>
          </div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
               <p className="text-slate-400 text-sm">Profit Margin</p>
               <h3 className="text-2xl font-bold text-purple-400">{margin.toFixed(1)}%</h3>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg"><PieIcon className="w-5 h-5 text-purple-400" /></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="text-white">Revenue by Plan</CardTitle></CardHeader>
          <CardContent><PieChart data={revenueByPlan} /></CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="text-white">Expenses by Category</CardTitle></CardHeader>
          <CardContent><BarChart data={expensesByCategory} /></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReports;