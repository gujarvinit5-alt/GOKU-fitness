import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, Activity } from 'lucide-react';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports = ({ data }) => {
  // We added 'payments' and 'expenses' to the data we need
  const { members, plans, payments = [], expenses = [] } = data;

  // --- 1. MEMBER ANALYTICS (Keep existing logic) ---
  const activeMembers = members.filter(m => m.status === 'active').length;
  const inactiveMembers = members.filter(m => m.status === 'inactive').length;
  
  const memberStatusData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [activeMembers, inactiveMembers],
      backgroundColor: ['#10b981', '#ef4444'], // Green, Red
      borderWidth: 0
    }]
  };

  const membersByPlanData = {
    labels: plans.map(p => p.name),
    datasets: [{
      label: 'Members',
      data: plans.map(p => members.filter(m => m.planId === p.id).length),
      backgroundColor: '#3b82f6', // Blue
      borderRadius: 4
    }]
  };

  // --- 2. FINANCIAL ANALYTICS (New!) ---
  // Calculate Revenue vs Expenses for Last 6 Months
  const processFinancialTrend = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleString('default', { month: 'short' }));
    }

    const revenueData = new Array(6).fill(0);
    const expenseData = new Array(6).fill(0);

    const getMonthIndex = (dateStr) => {
      const date = new Date(dateStr);
      const today = new Date();
      const diff = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth());
      return 5 - diff;
    };

    payments.forEach(p => {
      if (p.status === 'paid') {
        const idx = getMonthIndex(p.paymentDate);
        if (idx >= 0 && idx <= 5) revenueData[idx] += parseFloat(p.amount);
      }
    });

    expenses.forEach(e => {
      const idx = getMonthIndex(e.date);
      if (idx >= 0 && idx <= 5) expenseData[idx] += parseFloat(e.amount);
    });

    return { labels: months, revenueData, expenseData };
  };

  const trendData = processFinancialTrend();

  const financialChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: trendData.revenueData,
        backgroundColor: '#10B981', // Green
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: trendData.expenseData,
        backgroundColor: '#EF4444', // Red
        borderRadius: 4,
      },
    ],
  };

  // --- 3. KEY METRICS CALCULATION ---
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalProfit = totalRevenue - expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       
       {/* Top Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-800 border-none shadow-md p-6 flex items-center gap-4">
             <div className="p-3 rounded-full bg-blue-100 text-blue-600"><Users className="w-6 h-6" /></div>
             <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Total Members</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{members.length}</h3>
             </div>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 border-none shadow-md p-6 flex items-center gap-4">
             <div className="p-3 rounded-full bg-green-100 text-green-600"><DollarSign className="w-6 h-6" /></div>
             <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${totalRevenue.toLocaleString()}</h3>
             </div>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-none shadow-md p-6 flex items-center gap-4">
             <div className="p-3 rounded-full bg-purple-100 text-purple-600"><TrendingUp className="w-6 h-6" /></div>
             <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Net Profit</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${totalProfit.toLocaleString()}</h3>
             </div>
          </Card>
       </div>

       {/* Charts Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 1: Member Status (Doughnut) */}
          <Card className="bg-white dark:bg-slate-800 border-none shadow-lg">
             <CardHeader><CardTitle className="text-slate-800 dark:text-white">Member Status</CardTitle></CardHeader>
             <CardContent>
                <div className="h-64 flex justify-center">
                   <Doughnut 
                     data={memberStatusData} 
                     options={{ responsive: true, maintainAspectRatio: false }} 
                   />
                </div>
             </CardContent>
          </Card>

          {/* Chart 2: Members by Plan (Bar) */}
          <Card className="bg-white dark:bg-slate-800 border-none shadow-lg">
             <CardHeader><CardTitle className="text-slate-800 dark:text-white">Members by Plan</CardTitle></CardHeader>
             <CardContent>
                <div className="h-64">
                   <Bar 
                     data={membersByPlanData} 
                     options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } }
                     }} 
                   />
                </div>
             </CardContent>
          </Card>

          {/* Chart 3: FINANCIAL TRENDS (Replaced Attendance Chart) */}
          <Card className="bg-white dark:bg-slate-800 border-none shadow-lg md:col-span-2">
             <CardHeader><CardTitle className="text-slate-800 dark:text-white">Revenue vs Expenses (Last 6 Months)</CardTitle></CardHeader>
             <CardContent>
                <div className="h-64">
                   <Bar 
                     data={financialChartData} 
                     options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: {
                           y: { 
                              beginAtZero: true,
                              ticks: { callback: (v) => `$${v}` } 
                           }
                        }
                     }} 
                   />
                </div>
             </CardContent>
          </Card>
       </div>
    </div>
  );
};

export default Reports;