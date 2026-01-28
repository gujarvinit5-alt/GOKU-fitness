import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DoughnutChart, BarChart } from '@/components/ChartComponents';
import { Users, DollarSign, Calendar } from 'lucide-react';

const Reports = ({ data }) => {
  const { members, plans, attendance } = data;

  // Member Analytics
  const activeMembers = members.filter(m => m.status === 'active').length;
  const inactiveMembers = members.filter(m => m.status === 'inactive').length;
  
  const memberStatusData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [activeMembers, inactiveMembers],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0
    }]
  };

  const membersByPlanData = {
    labels: plans.map(p => p.name),
    datasets: [{
      label: 'Members',
      data: plans.map(p => members.filter(m => m.planId === p.id).length),
      backgroundColor: '#3b82f6'
    }]
  };

  // Attendance Analytics (Simplified)
  const attendanceByDay = [0, 1, 2, 3, 4, 5, 6].map(day => 
    attendance.filter(a => new Date(a.checkIn).getDay() === day).length
  );

  const attendanceChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Check-ins',
      data: attendanceByDay,
      backgroundColor: '#f59e0b'
    }]
  };

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
             <div className="p-3 rounded-full bg-blue-500/20 text-blue-400"><Users className="w-6 h-6" /></div>
             <div>
                <p className="text-slate-400 text-sm">Total Members</p>
                <h3 className="text-2xl font-bold text-white">{members.length}</h3>
             </div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
             <div className="p-3 rounded-full bg-green-500/20 text-green-400"><Users className="w-6 h-6" /></div>
             <div>
                <p className="text-slate-400 text-sm">Active Members</p>
                <h3 className="text-2xl font-bold text-white">{activeMembers}</h3>
             </div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6 flex items-center gap-4">
             <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400"><Calendar className="w-6 h-6" /></div>
             <div>
                <p className="text-slate-400 text-sm">Total Check-ins</p>
                <h3 className="text-2xl font-bold text-white">{attendance.length}</h3>
             </div>
          </Card>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
             <CardHeader><CardTitle className="text-white">Member Status</CardTitle></CardHeader>
             <CardContent><div className="h-64"><DoughnutChart data={memberStatusData} /></div></CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
             <CardHeader><CardTitle className="text-white">Members by Plan</CardTitle></CardHeader>
             <CardContent><div className="h-64"><BarChart data={membersByPlanData} /></div></CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800 md:col-span-2">
             <CardHeader><CardTitle className="text-white">Weekly Attendance Trends</CardTitle></CardHeader>
             <CardContent><div className="h-64"><BarChart data={attendanceChartData} /></div></CardContent>
          </Card>
       </div>
    </div>
  );
};

export default Reports;