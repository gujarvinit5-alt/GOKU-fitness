import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Camera, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormInput, FormSelect } from '@/components/ui/form-input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';
import { validateMemberForm } from '@/utils/ValidationUtils';
import { exportMembersToCSV } from '@/utils/ExportUtils';

const Members = ({ data }) => {
  const { members, plans, addMember, updateMember, deleteMember } = data;
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Camera handling
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);

  // --- CAMERA FIX: Attach stream to video element when state changes ---
  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (member = null) => {
    if (member) {
      setFormData(member);
      setSelectedMember(member);
      setCapturedImage(member.photo || null);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        planId: plans[0]?.id || '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      });
      setSelectedMember(null);
      setCapturedImage(null);
    }
    setErrors({});
    setIsModalOpen(true);
    setIsCameraOpen(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
      // Note: The useEffect above handles attaching the stream to the video tag
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({ title: "Error", description: "Could not access camera. Check permissions.", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const imageVariable = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageVariable);
      setFormData(prev => ({ ...prev, photo: imageVariable }));
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setFormData(prev => ({ ...prev, photo: null }));
    startCamera();
  };

  const handleModalClose = () => {
    stopCamera();
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateMemberForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const memberData = { ...formData, photo: capturedImage };

    if (selectedMember) {
      updateMember(selectedMember.id, memberData);
      toast({ title: 'Success', description: 'Member updated successfully' });
    } else {
      addMember(memberData);
      toast({ title: 'Success', description: 'Member added successfully' });
    }
    handleModalClose();
  };

  const handleDelete = () => {
    if (selectedMember) {
      deleteMember(selectedMember.id);
      toast({ title: 'Success', description: 'Member deleted successfully' });
      setIsDeleteOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportMembersToCSV(filteredMembers)} className="border-slate-300 text-slate-600 hover:bg-slate-50">
            Export CSV
          </Button>
          <Button onClick={() => handleOpenModal()} className="bg-[#FF6B35] hover:bg-[#e65a26] text-white shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-slate-100">
              <TableHead className="text-slate-500 font-semibold w-[80px]">Photo</TableHead>
              <TableHead className="text-slate-500 font-semibold">Name</TableHead>
              <TableHead className="text-slate-500 font-semibold">Contact</TableHead>
              <TableHead className="text-slate-500 font-semibold">Plan</TableHead>
              <TableHead className="text-slate-500 font-semibold">Join Date</TableHead>
              <TableHead className="text-slate-500 font-semibold">Status</TableHead>
              <TableHead className="text-slate-500 font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map(member => (
              <TableRow key={member.id} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                <TableCell>
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                     {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                           {member.name.charAt(0)}
                        </div>
                     )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-[#2C3E50]">{member.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-slate-600 text-xs">{member.email}</span>
                    <span className="text-slate-400 text-xs">{member.phone}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {plans.find(p => p.id === member.planId)?.name || 'Unknown'}
                </TableCell>
                <TableCell className="text-slate-600">{member.joinDate}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    member.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-rose-100 text-rose-600'
                  }`}>
                    {member.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-500 hover:bg-blue-50" onClick={() => handleOpenModal(member)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => { setSelectedMember(member); setIsDeleteOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedMember ? 'Edit Member Details' : 'Register New Member'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Camera Section */}
             <div className="lg:col-span-1 flex flex-col items-center gap-4">
                <div className="w-full aspect-[3/4] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                   {isCameraOpen ? (
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                   ) : capturedImage ? (
                      <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                   ) : (
                      <div className="text-center p-4">
                         <Camera className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                         <p className="text-sm text-slate-400">No photo captured</p>
                      </div>
                   )}
                   
                   <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex gap-2 w-full">
                   {!isCameraOpen && !capturedImage && (
                      <Button type="button" onClick={startCamera} className="w-full bg-[#2C3E50] hover:bg-[#1a252f] text-white">
                         <Camera className="w-4 h-4 mr-2" /> Start Camera
                      </Button>
                   )}
                   {isCameraOpen && (
                      <div className="flex gap-2 w-full">
                         <Button type="button" onClick={capturePhoto} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                           Capture
                         </Button>
                         <Button type="button" variant="outline" onClick={stopCamera} className="bg-white">
                           Cancel
                         </Button>
                      </div>
                   )}
                   {capturedImage && (
                      <Button type="button" onClick={handleRetake} variant="outline" className="w-full border-slate-300 text-slate-700">
                         <RefreshCw className="w-4 h-4 mr-2" /> Retake Photo
                      </Button>
                   )}
                </div>
             </div>

             {/* Form Fields Section */}
             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  error={errors.name}
                  required
                  className="bg-white border-slate-200 text-slate-900"
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  error={errors.email}
                  required
                  className="bg-white border-slate-200 text-slate-900"
                />
                <FormInput
                  label="Phone"
                  value={formData.phone || ''}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  error={errors.phone}
                  required
                  className="bg-white border-slate-200 text-slate-900"
                />
                <FormInput
                  label="Date of Birth"
                  type="date"
                  value={formData.dob || ''}
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                  className="bg-white border-slate-200 text-slate-900"
                />
                <FormInput
                  label="Address"
                  value={formData.address || ''}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="md:col-span-2 bg-white border-slate-200 text-slate-900"
                />
                <FormSelect
                  label="Membership Plan"
                  value={formData.planId || ''}
                  onChange={e => setFormData({...formData, planId: e.target.value})}
                  options={plans.map(p => ({ label: p.name, value: p.id }))}
                  error={errors.planId}
                  required
                  className="bg-white border-slate-200 text-slate-900"
                />
                <FormSelect
                  label="Status"
                  value={formData.status || 'active'}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' }
                  ]}
                  required
                  className="bg-white border-slate-200 text-slate-900"
                />
             </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleModalClose} className="border-slate-300 text-slate-700">Cancel</Button>
            <Button type="submit" className="bg-[#FF6B35] hover:bg-[#e65a26] text-white">Save Member</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Member"
        message={`Are you sure you want to delete ${selectedMember?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Members;