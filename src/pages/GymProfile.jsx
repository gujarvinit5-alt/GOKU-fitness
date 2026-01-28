import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput, FormTextarea } from '@/components/ui/form-input';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Save } from 'lucide-react';
import { validateGymProfileForm } from '@/utils/ValidationUtils';

const GymProfile = ({ data }) => {
  const { gymProfile, updateGymProfile } = data;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState(gymProfile);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value }
    }));
  };

  const handleSave = () => {
    const validationErrors = validateGymProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({ title: 'Error', description: 'Please check the form for errors', variant: 'destructive' });
      return;
    }
    
    updateGymProfile(formData);
    setErrors({});
    toast({ title: 'Success', description: 'Profile updated successfully' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Building2 className="w-6 h-6 text-blue-400" />
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormInput label="Gym Name" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} error={errors.name} required />
             <FormInput label="Phone" value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} error={errors.phone} required />
             <FormInput label="Email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} error={errors.email} required />
             <FormInput label="Website" value={formData.website || ''} onChange={e => handleChange('website', e.target.value)} />
          </div>
          <FormInput label="Address" value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} error={errors.address} required />
          <div className="grid grid-cols-3 gap-4">
             <FormInput label="City" value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} />
             <FormInput label="State" value={formData.state || ''} onChange={e => handleChange('state', e.target.value)} />
             <FormInput label="Zip Code" value={formData.zip || ''} onChange={e => handleChange('zip', e.target.value)} />
          </div>
          <FormTextarea label="Description" value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} />
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Bank Details (For Invoices)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Bank Name" value={formData.bankDetails?.bankName || ''} onChange={e => handleBankChange('bankName', e.target.value)} />
              <FormInput label="Account Name" value={formData.bankDetails?.accountHolder || ''} onChange={e => handleBankChange('accountHolder', e.target.value)} />
              <FormInput label="Account Number" value={formData.bankDetails?.accountNumber || ''} onChange={e => handleBankChange('accountNumber', e.target.value)} />
              <FormInput label="IFSC / Routing" value={formData.bankDetails?.ifsc || ''} onChange={e => handleBankChange('ifsc', e.target.value)} />
           </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          <Save className="w-4 h-4 mr-2" /> Save Profile
        </Button>
      </div>
    </div>
  );
};

export default GymProfile;