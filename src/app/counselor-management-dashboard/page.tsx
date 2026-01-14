'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';

interface Counselor {
  id: string;
  name: string;
  status: 'active' | 'busy' | 'offline';
  email: string;
  phone: string;
  assignedStudents: number;
}

const CounselorManagementDashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [counselors, setCounselors] = useState<Counselor[]>([
    { id: '1', name: 'Rajesh Kumar', status: 'active', email: 'rajesh.kumar@trademax.com', phone: '+91 98765 43210', assignedStudents: 12 },
    { id: '2', name: 'Priya Sharma', status: 'active', email: 'priya.sharma@trademax.com', phone: '+91 98765 43211', assignedStudents: 8 },
    { id: '3', name: 'Amit Patel', status: 'busy', email: 'amit.patel@trademax.com', phone: '+91 98765 43212', assignedStudents: 15 },
    { id: '4', name: 'Sneha Reddy', status: 'active', email: 'sneha.reddy@trademax.com', phone: '+91 98765 43213', assignedStudents: 10 },
    { id: '5', name: 'Vikram Singh', status: 'offline', email: 'vikram.singh@trademax.com', phone: '+91 98765 43214', assignedStudents: 5 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<Counselor | null>(null);
  const [formData, setFormData] = useState<Omit<Counselor, 'id' | 'assignedStudents'>>({
    name: '',
    status: 'active',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Check authentication
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') {
      router.push('/admin-login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      const savedCounselors = localStorage.getItem('counselorsList');
      if (savedCounselors) {
        setCounselors(JSON.parse(savedCounselors));
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('counselorsList', JSON.stringify(counselors));
  }, [counselors]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="ArrowPathIcon" size={48} variant="outline" className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const filteredCounselors = counselors.filter((counselor) => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || counselor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
      busy: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Busy' },
      offline: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Offline' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const openAddModal = () => {
    setEditingCounselor(null);
    setFormData({ name: '', status: 'active', email: '', phone: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (counselor: Counselor) => {
    setEditingCounselor(counselor);
    setFormData({
      name: counselor.name,
      status: counselor.status,
      email: counselor.email,
      phone: counselor.phone,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCounselor(null);
    setFormData({ name: '', status: 'active', email: '', phone: '' });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\+?[0-9\s-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCounselor) {
      setCounselors(counselors.map(c =>
        c.id === editingCounselor.id
          ? { ...c, ...formData }
          : c
      ));
    } else {
      const newCounselor: Counselor = {
        id: Date.now().toString(),
        ...formData,
        assignedStudents: 0,
      };
      setCounselors([...counselors, newCounselor]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this counselor?')) {
      setCounselors(counselors.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/80 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-6 mb-6 border border-white/60 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-headline font-semibold text-foreground mb-2">
                  Counselor Management
                </h1>
                <p className="text-muted-foreground font-body">
                  Manage counselor availability and assignments
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAddCounselor}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-white rounded-full font-cta font-semibold shadow-[0_12px_24px_rgba(10,132,255,0.35)] hover:bg-primary/90 transition-all"
                >
                  <Icon name="PlusIcon" size={20} variant="outline" />
                  <span>Add Counselor</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-5 py-2.5 border border-border text-foreground/80 rounded-full font-cta font-semibold hover:bg-black/5 transition-all"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={20} variant="outline" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white/80 rounded-3xl shadow-[0_16px_40px_rgba(15,23,42,0.08)] p-6 mb-6 border border-white/60 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search counselors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-body transition-all bg-white/80"
                  />
                  <Icon name="MagnifyingGlassIcon" size={20} variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-body font-medium transition-all ${
                    filterStatus === 'all' ?'bg-primary/10 text-primary' :'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg font-body font-medium transition-all ${
                    filterStatus === 'active' ?'bg-primary/10 text-primary' :'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('busy')}
                  className={`px-4 py-2 rounded-lg font-body font-medium transition-all ${
                    filterStatus === 'busy' ?'bg-primary/10 text-primary' :'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  Busy
                </button>
                <button
                  onClick={() => setFilterStatus('offline')}
                  className={`px-4 py-2 rounded-lg font-body font-medium transition-all ${
                    filterStatus === 'offline' ?'bg-primary/10 text-primary' :'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>
          </div>

          {/* Counselors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounselors.map((counselor) => (
              <div key={counselor.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-headline font-bold text-lg">
                      {counselor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-slate-900">{counselor.name}</h3>
                      {getStatusBadge(counselor.status)}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditCounselor(counselor)}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Icon name="PencilIcon" size={18} variant="outline" />
                    </button>
                    <button
                      onClick={() => handleDeleteCounselor(counselor.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Icon name="TrashIcon" size={18} variant="outline" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600 font-body">
                    <Icon name="EnvelopeIcon" size={16} variant="outline" className="mr-2 text-slate-400" />
                    {counselor.email}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 font-body">
                    <Icon name="PhoneIcon" size={16} variant="outline" className="mr-2 text-slate-400" />
                    {counselor.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 font-body">
                    <Icon name="UserGroupIcon" size={16} variant="outline" className="mr-2 text-slate-400" />
                    {counselor.assignedStudents} students assigned
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-bold text-slate-900">
                {editingCounselor ? 'Edit Counselor' : 'Add New Counselor'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Icon name="XMarkIcon" size={24} variant="outline" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-body font-semibold text-foreground mb-2">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-body transition-all ${
                    formErrors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-500'
                  }`}
                  placeholder="Enter counselor name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-error font-body flex items-center">
                    <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-body font-semibold text-foreground mb-2">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-body transition-all ${
                    formErrors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-500'
                  }`}
                  placeholder="counselor@trademax.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-error font-body flex items-center">
                    <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-body font-semibold text-foreground mb-2">
                  Phone <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-body transition-all ${
                    formErrors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-500'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-error font-body flex items-center">
                    <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-body font-semibold text-foreground mb-2">
                  Status <span className="text-error">*</span>
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 font-body transition-all"
                >
                  <option value="active">Active</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-cta font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-cta font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {editingCounselor ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorManagementDashboard;
