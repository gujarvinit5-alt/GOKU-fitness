import React, { useState } from 'react';
import { Clock, MessageCircle, Receipt, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Modal } from '@/components/ui/modal';
import { getMembershipStatus, sendWhatsApp } from '@/utils/GymUtils';

const AttendanceTracking = ({ data }) => {
  const { members, plans, attendance, checkIn, checkOut, payments } = data;
  const { toast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  
  // State for Receipt Modal
  const [receiptMember, setReceiptMember] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const todaysAttendance = attendance.filter(a => a.checkIn.startsWith(today));

  const handleCheckIn = () => {
    if (!selectedMemberId) return;
    const alreadyCheckedIn = todaysAttendance.find(a => a.memberId === selectedMemberId && !a.checkOut);
    if (alreadyCheckedIn) {
      toast({ title: 'Error', description: 'Already checked in!', variant: 'destructive' });
      return;
    }
    
    // Check Expiry before allowing check-in
    const member = members.find(m => m.id === selectedMemberId);
    const { status, daysLeft } = getMembershipStatus(member, plans);
    
    if (status === 'Expired') {
       toast({ title: 'Warning', description: `Membership Expired ${Math.abs(daysLeft)} days ago!`, variant: 'destructive' });
       // You can choose to return here to block access, or allow it with warning
    } else if (status === 'Ending Soon') {
       toast({ title: 'Alert', description: `Membership ends in ${daysLeft} days.`, variant: 'warning' });
    }

    checkIn(selectedMemberId);
    toast({ title: 'Success', description: 'Check-in recorded' });
    setSelectedMemberId('');
  };

  const handleCheckOut = (id) => {
    checkOut(id);
    toast({ title: 'Success', description: 'Checked out' });
  };

  const openReceipt = (memberId) => {
     const member = members.find(m => m.id === memberId);
     const lastPayment = payments
        .filter(p => p.memberId === memberId)
        .sort((a,b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];
     setReceiptMember({ member, lastPayment });
  };

  const handleWhatsAppReminder = (member) => {
     const { endDate, daysLeft } = getMembershipStatus(member, plans);
     const msg = `Hi ${member.name}, this is Elite Fitness. Your membership expires on ${endDate} (${daysLeft} days left). Please renew soon!`;
     sendWhatsApp(member.phone, msg);
  };

  return (
    <div className="space-y-6">
      {/* Quick Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg lg:col-span-1 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A] dark:text-white">
              <Clock className="w-5 h-5 text-[#FF6B35]" /> Quick Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF6B35]"
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

        {/* Attendance Table */}
        <Card className="border-none shadow-lg lg:col-span-2 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A] dark:text-white">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-700 border-none">
                  <TableHead className="font-bold text-[#1A1A1A] dark:text-white">Member</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A] dark:text-white">Membership Info</TableHead>
                  <TableHead className="font-bold text-[#1A1A1A] dark:text-white">Time</TableHead>
                  <TableHead className="text-right font-bold text-[#1A1A1A] dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysAttendance.map(record => {
                  const member = members.find(m => m.id === record.memberId);
                  const { status, startDate, endDate, daysLeft } = getMembershipStatus(member, plans);
                  
                  return (
                    <TableRow key={record.id} className="border-b border-slate-50 dark:border-slate-700">
                      <TableCell>
                        <div className="font-bold text-[#1A1A1A] dark:text-white">{member?.name}</div>
                        {status === 'Ending Soon' && (
                           <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-100 px-1 rounded w-fit mt-1">
                              <AlertTriangle className="w-3 h-3" /> Ends in {daysLeft} days
                           </span>
                        )}
                        {status === 'Expired' && (
                           <span className="flex items-center gap-1 text-[10px] text-red-600 bg-red-100 px-1 rounded w-fit mt-1">
                              <AlertTriangle className="w-3 h-3" /> EXPIRED
                           </span>
                        )}
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
                            <span>Start: {startDate}</span>
                            <span>End: {endDate}</span>
                         </div>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 font-mono">
                         {new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         {record.checkOut && <span className="text-xs ml-1 text-green-500">(Out)</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           {/* Receipt Button */}
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500" onClick={() => openReceipt(member.id)}>
                              <Receipt className="w-4 h-4" />
                           </Button>
                           
                           {/* WhatsApp Button (Only if active/ending soon) */}
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-green-500" onClick={() => handleWhatsAppReminder(member)}>
                              <MessageCircle className="w-4 h-4" />
                           </Button>

                           {!record.checkOut && (
                             <Button size="sm" variant="outline" className="h-8 text-red-500 hover:bg-red-50 border-red-200" onClick={() => handleCheckOut(record.id)}>
                               Check Out
                             </Button>
                           )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Receipt Modal */}
      <Modal isOpen={!!receiptMember} onClose={() => setReceiptMember(null)} title="Last Payment Receipt">
         {receiptMember && (
            <div className="space-y-4">
               <div className="text-center border-b pb-4">
                  <h3 className="text-xl font-bold">{receiptMember.member.name}</h3>
                  <p className="text-sm text-slate-500">{receiptMember.member.email}</p>
               </div>
               {receiptMember.lastPayment ? (
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <span className="text-slate-500">Invoice:</span>
                        <span className="font-mono font-bold">{receiptMember.lastPayment.invoiceNumber}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span>{receiptMember.lastPayment.paymentDate}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Amount:</span>
                        <span className="text-green-600 font-bold">${receiptMember.lastPayment.amount}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Status:</span>
                        <span className="uppercase font-bold text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{receiptMember.lastPayment.status}</span>
                     </div>
                  </div>
               ) : (
                  <p className="text-center text-red-500">No payment history found.</p>
               )}
               <Button className="w-full mt-4" onClick={() => setReceiptMember(null)}>Close</Button>
            </div>
         )}
      </Modal>
    </div>
  );
};

export default AttendanceTracking;