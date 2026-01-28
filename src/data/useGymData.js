import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  GYM_PROFILE: 'gym_profile',
  MEMBERS: 'gym_members',
  PLANS: 'gym_plans',
  ATTENDANCE: 'gym_attendance',
  PAYMENTS: 'gym_payments',
  INQUIRIES: 'gym_inquiries',
  EXPENSES: 'gym_expenses'
};

const INITIAL_DATA = {
  gymProfile: {
    name: 'Elite Fitness Center',
    logo: '',
    address: '123 Fitness Street',
    city: 'Gym City',
    state: 'GC',
    zip: '12345',
    phone: '+1 (555) 123-4567',
    email: 'info@elitefitness.com',
    description: 'Your premier destination for fitness and wellness',
    website: 'www.elitefitness.com',
    businessHours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '20:00', closed: false },
      sunday: { open: '08:00', close: '20:00', closed: true }
    },
    bankDetails: {
      accountHolder: 'Elite Fitness Inc.',
      accountNumber: '1234567890',
      bankName: 'Global Bank',
      ifsc: 'GB000123'
    }
  },
  members: [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-111-2222', dob: '1990-05-15', address: '456 Member St', planId: '1', joinDate: '2024-01-15', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-222-3333', dob: '1992-08-22', address: '789 Fitness Ave', planId: '2', joinDate: '2024-02-01', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-333-4444', dob: '1988-03-10', address: '321 Gym Rd', planId: '1', joinDate: '2023-11-20', status: 'inactive' }
  ],
  plans: [
    { id: '1', name: 'Monthly Basic', duration: 1, price: 49.99, description: 'Basic access', features: ['Gym Access'], isActive: true },
    { id: '2', name: 'Quarterly Premium', duration: 3, price: 129.99, description: 'Premium access', features: ['Gym Access', 'Classes'], isActive: true },
    { id: '3', name: 'Yearly Elite', duration: 12, price: 449.99, description: 'All access', features: ['All Features'], isActive: true }
  ],
  attendance: [
    { id: '1', memberId: '1', checkIn: '2024-01-27T08:30:00', checkOut: '2024-01-27T10:15:00' },
    { id: '2', memberId: '2', checkIn: '2024-01-27T09:00:00', checkOut: '2024-01-27T10:45:00' }
  ],
  payments: [
    { id: '1', memberId: '1', amount: 49.99, planId: '1', paymentMethod: 'card', paymentDate: '2024-01-15', status: 'paid', invoiceNumber: 'INV-20240115-0001' },
    { id: '2', memberId: '2', amount: 129.99, planId: '2', paymentMethod: 'cash', paymentDate: '2024-02-01', status: 'paid', invoiceNumber: 'INV-20240201-0002' },
    { id: '3', memberId: '1', amount: 49.99, planId: '1', paymentMethod: 'online', paymentDate: '2024-02-15', status: 'pending', invoiceNumber: 'INV-20240215-0003' }
  ],
  inquiries: [
    { id: '1', name: 'Sarah Williams', email: 'sarah@example.com', phone: '555-444-5555', inquiryType: 'membership', message: 'Interested in quarterly', source: 'website', status: 'new', inquiryDate: '2024-01-25', notes: [] },
    { id: '2', name: 'Tom Brown', email: 'tom@example.com', phone: '555-555-6666', inquiryType: 'training', message: 'Personal trainer needed', source: 'referral', status: 'contacted', inquiryDate: '2024-01-24', notes: [{text: 'Called client', date: '2024-01-25'}] }
  ],
  expenses: [
    { id: '1', category: 'Rent', amount: 2000, description: 'Monthly Rent', date: '2024-01-01' },
    { id: '2', category: 'Utilities', amount: 450, description: 'Electric Bill', date: '2024-01-05' },
    { id: '3', category: 'Maintenance', amount: 300, description: 'Cleaning', date: '2024-01-10' }
  ]
};

export const useGymData = () => {
  // State Initialization
  const [gymProfile, setGymProfile] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.GYM_PROFILE)) || INITIAL_DATA.gymProfile);
  const [members, setMembers] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS)) || INITIAL_DATA.members);
  const [plans, setPlans] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS)) || INITIAL_DATA.plans);
  const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || INITIAL_DATA.attendance);
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS)) || INITIAL_DATA.payments);
  const [inquiries, setInquiries] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES)) || INITIAL_DATA.inquiries);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || INITIAL_DATA.expenses);

  // Persistence Effects
  useEffect(() => localStorage.setItem(STORAGE_KEYS.GYM_PROFILE, JSON.stringify(gymProfile)), [gymProfile]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members)), [members]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans)), [plans]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance)), [attendance]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries)), [inquiries]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses)), [expenses]);

  // --- CRUD Operations ---

  // Gym Profile
  const updateGymProfile = (data) => setGymProfile(prev => ({ ...prev, ...data }));
  
  // Members
  const addMember = (member) => {
    const newMember = { ...member, id: Date.now().toString(), joinDate: member.joinDate || new Date().toISOString().split('T')[0] };
    setMembers(prev => [...prev, newMember]);
    return newMember;
  };
  const updateMember = (id, data) => setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  const deleteMember = (id) => setMembers(prev => prev.filter(m => m.id !== id));
  const getMemberById = (id) => members.find(m => m.id === id);

  // Plans
  const addPlan = (plan) => {
    const newPlan = { ...plan, id: Date.now().toString(), isActive: true };
    setPlans(prev => [...prev, newPlan]);
  };
  const updatePlan = (id, data) => setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deletePlan = (id) => setPlans(prev => prev.filter(p => p.id !== id));

  // Attendance
  const checkIn = (memberId) => {
    const newRecord = { id: Date.now().toString(), memberId, checkIn: new Date().toISOString(), checkOut: null };
    setAttendance(prev => [...prev, newRecord]);
  };
  const checkOut = (id) => setAttendance(prev => prev.map(a => a.id === id ? { ...a, checkOut: new Date().toISOString() } : a));

  // Payments
  const addPayment = (payment) => {
    const count = payments.length + 1;
    const date = new Date();
    const invoiceNumber = `INV-${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}-${String(count).padStart(4,'0')}`;
    const newPayment = { ...payment, id: Date.now().toString(), invoiceNumber };
    setPayments(prev => [...prev, newPayment]);
    return newPayment;
  };
  const updatePayment = (id, data) => setPayments(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deletePayment = (id) => setPayments(prev => prev.filter(p => p.id !== id));

  // Inquiries
  const addInquiry = (inquiry) => {
    const newInquiry = { ...inquiry, id: Date.now().toString(), status: 'new', inquiryDate: new Date().toISOString().split('T')[0], notes: [] };
    setInquiries(prev => [...prev, newInquiry]);
  };
  const updateInquiry = (id, data) => setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteInquiry = (id) => setInquiries(prev => prev.filter(i => i.id !== id));
  const addInquiryNote = (id, noteText) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, notes: [...(i.notes || []), { text: noteText, date: new Date().toISOString() }] } : i));
  };
  const convertInquiryToMember = (inquiry, planId) => {
    const newMember = {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      planId: planId,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      address: 'N/A' // Placeholder
    };
    addMember(newMember);
    updateInquiry(inquiry.id, { status: 'converted' });
  };

  // Expenses
  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses(prev => [...prev, newExpense]);
  };

  return {
    gymProfile, updateGymProfile,
    members, addMember, updateMember, deleteMember, getMemberById,
    plans, addPlan, updatePlan, deletePlan,
    attendance, checkIn, checkOut,
    payments, addPayment, updatePayment, deletePayment,
    inquiries, addInquiry, updateInquiry, deleteInquiry, addInquiryNote, convertInquiryToMember,
    expenses, addExpense
  };
};