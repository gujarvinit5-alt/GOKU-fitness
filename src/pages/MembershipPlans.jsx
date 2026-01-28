import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, ClipboardList } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormInput, FormTextarea } from '@/components/ui/form-input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';
import { validatePlanForm } from '@/utils/ValidationUtils';
import { motion } from 'framer-motion';

const MembershipPlans = ({ data }) => {
  const { plans, addPlan, updatePlan, deletePlan } = data;
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setFormData({
        ...plan,
        featuresString: plan.features.join('\n')
      });
      setSelectedPlan(plan);
    } else {
      setFormData({
        name: '',
        duration: '',
        price: '',
        description: '',
        featuresString: ''
      });
      setSelectedPlan(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePlanForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const planData = {
      ...formData,
      features: formData.featuresString.split('\n').map(f => f.trim()).filter(f => f),
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };
    delete planData.featuresString;

    if (selectedPlan) {
      updatePlan(selectedPlan.id, planData);
      toast({ title: 'Success', description: 'Plan updated successfully' });
    } else {
      addPlan(planData);
      toast({ title: 'Success', description: 'Plan created successfully' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedPlan) {
      deletePlan(selectedPlan.id);
      toast({ title: 'Success', description: 'Plan deleted successfully' });
      setIsDeleteOpen(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
           <h2 className="text-2xl font-bold text-[#2C3E50]">Membership Plans</h2>
           <p className="text-slate-500 text-sm">Manage your gym's pricing tiers and features</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#FF6B35] hover:bg-[#e65a26] text-white shadow-lg shadow-orange-500/20">
          <Plus className="w-4 h-4 mr-2" /> Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
             key={plan.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-slate-100 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B35] to-[#FF9F43]" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="bg-orange-50 p-2 rounded-lg">
                     <ClipboardList className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-500 hover:bg-blue-50" onClick={() => handleOpenModal(plan)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => { setSelectedPlan(plan); setIsDeleteOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-[#2C3E50] mt-4">{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-bold text-[#FF6B35]">${plan.price}</span>
                  <span className="text-sm font-medium text-slate-500 ml-1">/ {plan.duration} months</span>
                </div>
                <p className="text-slate-500 text-sm mt-2 min-h-[40px]">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-px bg-slate-100 my-4" />
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="mt-0.5 rounded-full bg-emerald-100 p-0.5">
                         <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                  {plan.features.length === 0 && (
                     <li className="text-slate-400 text-sm italic">No features listed</li>
                  )}
                </ul>
                <div className="mt-8">
                   <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white" onClick={() => handleOpenModal(plan)}>
                      Edit Details
                   </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {/* Add New Plan Placeholder Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: plans.length * 0.1 }}
           onClick={() => handleOpenModal()}
           className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[#FF6B35] hover:bg-orange-50/50 transition-all duration-300 min-h-[300px] group"
        >
           <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-[#FF6B35] transition-colors" />
           </div>
           <h3 className="text-lg font-bold text-slate-500 group-hover:text-[#FF6B35] transition-colors">Add New Plan</h3>
           <p className="text-sm text-slate-400 text-center mt-2">Create a new membership tier with custom features</p>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlan ? 'Edit Membership Plan' : 'Create New Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Plan Name"
            placeholder="e.g. Gold Membership"
            value={formData.name || ''}
            onChange={e => setFormData({...formData, name: e.target.value})}
            error={errors.name}
            required
            className="bg-white border-slate-200 text-slate-900 focus:ring-[#FF6B35]"
          />
          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="Duration (Months)"
              type="number"
              placeholder="1"
              value={formData.duration || ''}
              onChange={e => setFormData({...formData, duration: e.target.value})}
              error={errors.duration}
              required
              className="bg-white border-slate-200 text-slate-900 focus:ring-[#FF6B35]"
            />
            <FormInput
              label="Price ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price || ''}
              onChange={e => setFormData({...formData, price: e.target.value})}
              error={errors.price}
              required
              className="bg-white border-slate-200 text-slate-900 focus:ring-[#FF6B35]"
            />
          </div>
          <FormTextarea
            label="Description"
            placeholder="Brief summary of this plan..."
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
            rows={2}
            className="bg-white border-slate-200 text-slate-900 focus:ring-[#FF6B35]"
          />
          <FormTextarea
            label="Features (One per line)"
            value={formData.featuresString || ''}
            onChange={e => setFormData({...formData, featuresString: e.target.value})}
            rows={5}
            placeholder="Gym Access&#10;Free Wifi&#10;Personal Trainer&#10;Sauna Access"
            className="bg-white border-slate-200 text-slate-900 focus:ring-[#FF6B35] font-mono text-sm"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</Button>
            <Button type="submit" className="bg-[#FF6B35] hover:bg-[#e65a26] text-white">
               {selectedPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message={`Are you sure you want to delete "${selectedPlan?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default MembershipPlans;