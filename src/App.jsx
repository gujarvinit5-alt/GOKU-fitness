import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/MainLayout';
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
      case 'reports': return <Reports data={gymData} />; // This now shows your Revenue charts
      case 'analytics': return <Reports data={gymData} />; // Redirect analytics to reports
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
      
      {/* We pass 'data={gymData}' here so the Header inside MainLayout 
         can use it for Search, Notifications, and Admin Profile.
      */}
      <MainLayout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        gymProfile={gymData.gymProfile}
        data={gymData} 
      >
        {renderContent()}
      </MainLayout>
      
      <Toaster />
    </>
  );
}

export default App;