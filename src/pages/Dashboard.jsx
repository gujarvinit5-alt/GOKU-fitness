import React from 'react';
import { Users, DollarSign, TrendingUp, Calendar, CreditCard, Activity, AlertCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, BarChart } from '@/components/ChartComponents';
import { Button } from '@/components/ui/button';

const Dashboard = ({ data, setActiveTab }) => {
  const { members, payments, expenses } = data;
  
  const activeMembers = members.filter(m => m.status === 'active').length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthRevenue = payments
    .filter(p => {
      const d = new Date(p.paymentDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && p.status === 'paid';
    })
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
  const currentMonthExpenses = expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const profit = currentMonthRevenue - currentMonthExpenses;

  // Pending Payments logic
  const pendingPaymentsCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Quick Filters - Visual Only for Dashboard */}
      <div className="flex gap-4 overflow-x-auto pb-2">
         {['Today', 'This Week', 'This Month', 'Year to Date'].map((filter, i) => (
            <button key={filter} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 2 ? 'bg-[#1A1A1A] text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
               {filter}
            </button>
         ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Members"
          value={activeMembers}
          icon={Users}
          color="orange"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${currentMonthRevenue.toFixed(0)}`}
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPaymentsCount}
          icon={AlertCircle}
          color="red"
          trend="down"
          trendValue="Needs Attention"
        />
        <StatCard
          title="Net Profit"
          value={`$${profit.toFixed(0)}`}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-lg hover-scale">
            <CardHeader>
              <CardTitle className="text-[#1A1A1A]">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for chart to ensure it renders with new styling */}
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                 <p className="text-slate-400">Chart Component (Revenue vs Expenses)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#333] text-white border-none shadow-xl relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35] opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             
             <CardHeader>
              <CardTitle className="text-white relative z-10">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 relative z-10">
              <Button onClick={() => setActiveTab('members')} className="w-full bg-[#FF6B35] hover:bg-[#E85D2E] text-white border-none shadow-lg shadow-orange-900/20 h-12 text-lg font-semibold">
                <Users className="w-5 h-5 mr-3" /> Add Member
              </Button>
              <Button onClick={() => setActiveTab('billing')} className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-12">
                <CreditCard className="w-5 h-5 mr-3" /> Record Payment
              </Button>
              <Button onClick={() => setActiveTab('attendance')} className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-12">
                <Clock className="w-5 h-5 mr-3" /> Quick Check-in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;