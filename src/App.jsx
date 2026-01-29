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
  
  // State for Auto-Opening Modals
  const [shouldOpenAddMember, setShouldOpenAddMember] = useState(false);
  const [memberIdToView, setMemberIdToView] = useState(null); // <--- NEW: Track which profile to open
  
  const gymData = useGymData();

  // Handle navigation from Dashboard
  const handleNavigate = (tab, action) => {
    setActiveTab(tab);
    if (tab === 'members' && action === 'add') {
      setShouldOpenAddMember(true);
    }
  };

  // Handle viewing a specific member from Search
  const handleViewMember = (id) => {
    setActiveTab('members');
    setMemberIdToView(id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard data={gymData} onNavigate={handleNavigate} />;
      case 'members': 
        return (
          <Members 
            data={gymData} 
            shouldOpenModal={shouldOpenAddMember} 
            setShouldOpenModal={setShouldOpenAddMember}
            memberIdToView={memberIdToView}         // <--- Pass ID down
            setMemberIdToView={setMemberIdToView}   // <--- Pass reset function
          />
        );
      case 'plans': return <MembershipPlans data={gymData} />;
      case 'attendance': return <AttendanceTracking data={gymData} />;
      case 'billing': return <BillingPayment data={gymData} />;
      case 'expenses': return <ExpenseManagement />; 
      case 'inquiries': return <InquiryManagement data={gymData} />;
      case 'sms': return <SMSNotifications />; 
      case 'financial': return <FinancialReports data={gymData} />;
      case 'reports': return <Reports data={gymData} />;
      case 'analytics': return <Reports data={gymData} />;
      case 'profile': return <GymProfile data={gymData} />;
      default: return <Dashboard data={gymData} onNavigate={handleNavigate} />;
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
        onViewMember={handleViewMember} // <--- Pass the new handler to Layout
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