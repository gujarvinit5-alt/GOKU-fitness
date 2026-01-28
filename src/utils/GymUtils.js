// src/utils/GymUtils.js

export const getMembershipStatus = (member, plans) => {
  if (!member || !plans) return { status: 'Unknown', daysLeft: 0, endDate: null };

  const plan = plans.find(p => p.id === member.planId);
  if (!plan) return { status: 'No Plan', daysLeft: 0, endDate: null };

  // Calculate End Date
  const joinDate = new Date(member.joinDate);
  const durationMonths = plan.duration || 1; // Default 1 month if missing
  const endDate = new Date(joinDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);

  // Calculate Days Left
  const today = new Date();
  const diffTime = endDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status = 'Active';
  if (daysLeft < 0) status = 'Expired';
  else if (daysLeft <= 7) status = 'Ending Soon';

  return { 
    status, 
    daysLeft, 
    startDate: member.joinDate,
    endDate: endDate.toISOString().split('T')[0],
    planName: plan.name 
  };
};

export const sendWhatsApp = (phone, message) => {
  // Remove non-numeric chars
  const cleanPhone = phone.replace(/\D/g, ''); 
  // Add country code if missing (Assuming India +91 for now, change as needed)
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};