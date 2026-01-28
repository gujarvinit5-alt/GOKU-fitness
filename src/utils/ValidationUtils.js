export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  // Accepts formats like +1 (555) 555-5555, 555-555-5555, 5555555555
  const regex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  return regex.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const validateMemberForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Name is required';
  if (!validateRequired(data.email)) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email format';
  if (!validateRequired(data.phone)) errors.phone = 'Phone is required';
  else if (!validatePhone(data.phone)) errors.phone = 'Invalid phone format';
  if (!validateRequired(data.planId)) errors.planId = 'Membership plan is required';
  return errors;
};

export const validatePlanForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Plan name is required';
  if (!validateRequired(data.duration)) errors.duration = 'Duration is required';
  else if (!validatePositiveNumber(data.duration)) errors.duration = 'Duration must be a positive number';
  if (!validateRequired(data.price)) errors.price = 'Price is required';
  else if (!validatePositiveNumber(data.price)) errors.price = 'Price must be a positive number';
  return errors;
};

export const validatePaymentForm = (data) => {
  const errors = {};
  if (!validateRequired(data.memberId)) errors.memberId = 'Member is required';
  if (!validateRequired(data.amount)) errors.amount = 'Amount is required';
  else if (!validatePositiveNumber(data.amount)) errors.amount = 'Amount must be a positive number';
  if (!validateRequired(data.paymentMethod)) errors.paymentMethod = 'Payment method is required';
  if (!validateRequired(data.paymentDate)) errors.paymentDate = 'Date is required';
  return errors;
};

export const validateInquiryForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Name is required';
  if (!validateRequired(data.email)) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email format';
  if (!validateRequired(data.phone)) errors.phone = 'Phone is required';
  else if (!validatePhone(data.phone)) errors.phone = 'Invalid phone format';
  if (!validateRequired(data.inquiryType)) errors.inquiryType = 'Inquiry type is required';
  return errors;
};

export const validateGymProfileForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Gym name is required';
  if (!validateRequired(data.address)) errors.address = 'Address is required';
  if (!validateRequired(data.email)) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email format';
  if (!validateRequired(data.phone)) errors.phone = 'Phone is required';
  return errors;
};

export const validateBankDetailsForm = (data) => {
  const errors = {};
  // Optional validation - only validate if any field is filled
  if (data.accountNumber && !validateNumber(data.accountNumber)) errors.accountNumber = 'Invalid account number';
  return errors;
};

export const validateFollowUpForm = (data) => {
  const errors = {};
  if (!validateRequired(data.date)) errors.date = 'Date is required';
  if (!validateRequired(data.notes)) errors.notes = 'Notes are required';
  return errors;
};