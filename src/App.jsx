import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/MainLayout';
import Header from '@/components/Header'; // <--- NEW IMPORT
import { useGymData } from '@/hooks/useGymData';

// Pages
import Dashboard from '@/pages/Dashboard';
import Members from '@/pages/Members';
import MembershipPlans from '@/pages/MembershipPlans';
import AttendanceTracking from '@/pages/AttendanceTracking';
import BillingPayment from '@/pages/BillingPayment';
import InquiryManagement from '@/pages/InquiryManagement';
import FinancialReports from '@/pages/FinancialReports';
import Reports from '@/pages/Reports';
import GymProfile from '@/pages/GymProfile';
import ExpenseManagement from '@/pages/ExpenseManagement';
import SMSNotifications from '@/pages/SMSNotifications';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const gymData = useGymData();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={gymData} setActiveTab={setActiveTab} />;
      case 'members': return <Members data={gymData} />;
      case 'plans': return <MembershipPlans data={gymData} />;
      case 'attendance': return <AttendanceTracking data={gymData} />;
      case 'billing': return <BillingPayment data={gymData} />;
      case 'expenses': return <ExpenseManagement />; 
      case 'inquiries': return <InquiryManagement data={gymData} />;
      case 'sms': return <SMSNotifications />; 
      case 'financial': return <FinancialReports data={gymData} />;
      case 'reports': return <Reports data={gymData} />;
      case 'profile': return <GymProfile data={gymData} />;
      default: return <Dashboard data={gymData} setActiveTab={setActiveTab} />;
    }
  };

  const getPageTitle = () => {
    return `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - GOKU Fitness`;
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
      </Helmet>
      
      <MainLayout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        gymProfile={gymData.gymProfile}
      >
        {/* --- NEW LAYOUT STRUCTURE --- */}
        {/* This div ensures the Header stays at top and content scrolls below it */}
        <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
           
           {/* 1. The Interactive Header */}
           <Header data={gymData} />
           
           {/* 2. The Scrollable Page Content */}
           <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {renderContent()}
           </main>

        </div>
      </MainLayout>
      
      <Toaster />
    </>
  );
}

export default App;