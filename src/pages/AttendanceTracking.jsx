import React, { useState } from 'react';
import { Calendar, Clock, UserCheck, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

const AttendanceTracking = ({ data }) => {
  const { members, attendance, checkIn, checkOut } = data;
  const { toast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todaysAttendance = attendance.filter(a => a.checkIn.startsWith(today));

  // Regularity Logic
  const calculateRegularity = (memberId) => {
    // Mock logic: check last 30 days attendance count
    const count = attendance.filter(a => a.memberId === memberId).length;
    return count > 10 ? 'Regular' : 'Irregular';
  };

  const handleCheckIn = () => {
    if (!selectedMemberId) return;
    const alreadyCheckedIn = todaysAttendance.find(a => a.memberId === selectedMemberId && !a.checkOut);
    if (alreadyCheckedIn) {
      toast({ title: 'Error', description: 'Already checked in!', variant: 'destructive' });
      return;
    }
    checkIn(selectedMemberId);
    toast({ title: 'Success', description: 'Check-in recorded' });
    setSelectedMemberId('');
  };

  const handleCheckOut = (id) => {
    checkOut(id);
    toast({ title: 'Success', description: 'Checked out' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg lg:col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <Clock className="w-5 h-5 text-[#FF6B35]" /> Quick Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              className="w-full bg-slate-50 border-none rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-[#FF6B35]"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              <option value="">Select Member...</option>
              {members.filter(m => m.status === 'active').map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <Button className="w-full bg-[#FF6B35] hover:bg-[#E85D2E]" onClick={handleCheckIn} disabled={!selectedMemberId}>
              Check In
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A]">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-none">
                  <TableHead className="font-bold text-[#1A1A1A]">Member</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A]">Status</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A]">Check In</TableHead>
                  <TableHead className="text-right font-bold text-[#1A1A1A]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysAttendance.map(record => {
                  const member = members.find(m => m.id === record.memberId);
                  const regularity = calculateRegularity(record.memberId);
                  return (
                    <TableRow key={record.id} className="border-b border-slate-50">
                      <TableCell>
                        <div className="font-bold text-[#1A1A1A]">{member?.name}</div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${regularity === 'Regular' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {regularity}
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.checkOut ? (
                           <span className="text-slate-400 font-medium">Completed</span>
                        ) : (
                           <span className="text-[#FF6B35] font-bold animate-pulse">Active Now</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500 font-mono">
                         {new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </TableCell>
                      <TableCell className="text-right">
                        {!record.checkOut && (
                          <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={() => handleCheckOut(record.id)}>
                            Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {todaysAttendance.length === 0 && (
                   <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-400">No check-ins today yet.</TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceTracking;