export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const cell = row[header];
      return typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportMembersToCSV = (members) => {
  const data = members.map(m => ({
    Name: m.name,
    Email: m.email,
    Phone: m.phone,
    'Date of Birth': m.dob,
    Address: m.address,
    'Join Date': m.joinDate,
    Status: m.status
  }));
  exportToCSV(data, 'members');
};

export const exportAttendanceToCSV = (attendance, members) => {
  const data = attendance.map(a => {
    const member = members.find(m => m.id === a.memberId);
    return {
      'Member Name': member?.name || 'Unknown',
      'Check In': new Date(a.checkIn).toLocaleString(),
      'Check Out': a.checkOut ? new Date(a.checkOut).toLocaleString() : 'Not checked out'
    };
  });
  exportToCSV(data, 'attendance');
};

export const exportPaymentsToCSV = (payments, members, plans) => {
  const data = payments.map(p => {
    const member = members.find(m => m.id === p.memberId);
    const plan = plans.find(pl => pl.id === p.planId);
    return {
      'Invoice Number': p.invoiceNumber,
      'Member Name': member?.name || 'Unknown',
      'Plan': plan?.name || 'Unknown',
      'Amount': `$${p.amount}`,
      'Payment Date': p.paymentDate,
      'Payment Method': p.paymentMethod,
      'Status': p.status
    };
  });
  exportToCSV(data, 'payments');
};

export const exportFinancialReportToCSV = (data) => {
  exportToCSV(data, 'financial_report');
};

export const exportInquiriesToCSV = (inquiries) => {
  const data = inquiries.map(i => ({
    Name: i.name,
    Email: i.email,
    Phone: i.phone,
    Type: i.inquiryType,
    Source: i.source,
    Status: i.status,
    Date: i.inquiryDate
  }));
  exportToCSV(data, 'inquiries');
};