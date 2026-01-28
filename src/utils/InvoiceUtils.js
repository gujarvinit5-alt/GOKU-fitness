import jsPDF from 'jspdf';

export const generateInvoiceNumber = (sequence) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `INV-${year}${month}${day}-${seq}`;
};

export const generateInvoicePDF = (gymProfile, member, payment, plan) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text(gymProfile.name || 'Gym Name', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(gymProfile.address || '', 20, 30);
  doc.text(`${gymProfile.city || ''}, ${gymProfile.state || ''} ${gymProfile.zip || ''}`, 20, 35);
  doc.text(`Phone: ${gymProfile.phone || ''}`, 20, 40);
  doc.text(`Email: ${gymProfile.email || ''}`, 20, 45);

  // Invoice Details
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Invoice #: ${payment.invoiceNumber}`, pageWidth - 20, 30, { align: 'right' });
  doc.text(`Date: ${payment.paymentDate}`, pageWidth - 20, 35, { align: 'right' });
  doc.text(`Status: ${payment.status.toUpperCase()}`, pageWidth - 20, 40, { align: 'right' });

  // Bill To
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Bill To:', 20, 60);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(member.name || '', 20, 66);
  doc.text(member.email || '', 20, 71);
  doc.text(member.phone || '', 20, 76);

  // Table Header
  const tableTop = 90;
  doc.setFillColor(243, 244, 246);
  doc.rect(20, tableTop, pageWidth - 40, 10, 'F');
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('Description', 25, tableTop + 7);
  doc.text('Amount', pageWidth - 25, tableTop + 7, { align: 'right' });

  // Table Content
  doc.text(`${plan?.name || 'Membership'} - ${plan?.duration || 1} Month(s)`, 25, tableTop + 20);
  doc.text(`$${parseFloat(payment.amount).toFixed(2)}`, pageWidth - 25, tableTop + 20, { align: 'right' });

  // Total
  doc.setLineWidth(0.5);
  doc.line(20, tableTop + 30, pageWidth - 20, tableTop + 30);
  doc.setFontSize(12);
  doc.text('Total:', pageWidth - 60, tableTop + 40);
  doc.text(`$${parseFloat(payment.amount).toFixed(2)}`, pageWidth - 25, tableTop + 40, { align: 'right' });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Thank you for your business!', pageWidth / 2, tableTop + 60, { align: 'center' });

  return doc;
};

export const downloadInvoicePDF = (doc, invoiceNumber) => {
  doc.save(`${invoiceNumber}.pdf`);
};