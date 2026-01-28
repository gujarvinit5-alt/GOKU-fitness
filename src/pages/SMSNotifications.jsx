import React, { useState } from 'react';
import { MessageSquare, Bell, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SMSNotifications = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-lg">
          <CardHeader className="border-b border-slate-100 pb-4">
             <div className="flex justify-between items-center">
               <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
                 <MessageSquare className="w-6 h-6 text-[#FF6B35]" />
                 SMS Configuration
               </CardTitle>
               <div className="flex items-center gap-2">
                 <span className={`text-sm font-bold ${enabled ? 'text-green-500' : 'text-slate-400'}`}>
                   {enabled ? 'Active' : 'Disabled'}
                 </span>
                 <button 
                   onClick={() => setEnabled(!enabled)}
                   className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-[#FF6B35]' : 'bg-slate-200'}`}
                 >
                   <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`} />
                 </button>
               </div>
             </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3">
               <AlertCircle className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-bold text-[#1A1A1A]">API Integration Required</h4>
                 <p className="text-sm text-slate-600 mt-1">
                   To send real SMS messages, connect a provider like Twilio or AWS SNS. Currently running in simulation mode.
                 </p>
               </div>
             </div>

             <div className="space-y-4">
                <h3 className="font-bold text-[#1A1A1A]">Automatic Triggers</h3>
                <div className="grid gap-3">
                   {['Membership Expiry Warning (7 days before)', 'Payment Confirmation', 'Missed Class Reminder', 'New Offer Announcements'].map((trigger, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                         <span className="text-slate-700 font-medium">{trigger}</span>
                         <div className="w-4 h-4 rounded-full border-2 border-[#FF6B35] bg-[#FF6B35] flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-[#1A1A1A] text-white">
          <CardHeader>
            <CardTitle>Usage Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
               <p className="text-slate-400 text-sm">Messages Sent (This Month)</p>
               <h3 className="text-4xl font-bold text-[#FF6B35] mt-1">1,248</h3>
             </div>
             <div>
               <p className="text-slate-400 text-sm">Delivery Rate</p>
               <h3 className="text-2xl font-bold mt-1">99.4%</h3>
             </div>
             <div>
               <p className="text-slate-400 text-sm">Estimated Cost</p>
               <h3 className="text-2xl font-bold mt-1">$12.48</h3>
             </div>
             <div className="pt-4 border-t border-white/10">
               <Button className="w-full bg-white text-[#1A1A1A] hover:bg-slate-200">
                 <Settings className="w-4 h-4 mr-2" /> Manage Plan
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
           <CardTitle>Recent Notification Log</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
              {[
                { to: 'John Doe', msg: 'Your membership expires in 3 days. Renew now to keep your streak!', status: 'Delivered', time: '2 mins ago' },
                { to: 'Sarah Smith', msg: 'Payment received: $49.99. Thank you!', status: 'Delivered', time: '1 hour ago' },
                { to: 'Mike Ross', msg: 'Welcome to GOKU Fitness! Let\'s get started.', status: 'Failed', time: '5 hours ago' },
              ].map((log, i) => (
                 <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100 last:border-0">
                    <div>
                       <p className="font-bold text-[#1A1A1A]">{log.to}</p>
                       <p className="text-xs text-slate-500 truncate max-w-md">{log.msg}</p>
                    </div>
                    <div className="text-right">
                       <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          log.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                       }`}>
                          {log.status}
                       </span>
                       <p className="text-xs text-slate-400 mt-1">{log.time}</p>
                    </div>
                 </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMSNotifications;