import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Users,
  DoorOpen,
  MapPin,
  Layers,
  Phone,
  User,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Wifi,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { hostelService } from '../../services/api';
import { getHostelImage } from '../../data/campusImages';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner, TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';

export const ManageHostels = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentHostel, setCurrentHostel] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'Boys',
    location: '',
    totalFloors: 3,
    description: '',
    wardenName: '',
    wardenContact: '',
  });

  const { success, error: toastError } = useToast();

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await hostelService.getAll({
        search: searchTerm || undefined,
        type: selectedType !== 'All' ? selectedType : undefined,
      });
      if (res.data.success) {
        setHostels(res.data.hostels);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, [searchTerm, selectedType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      type: 'Boys',
      location: '',
      totalFloors: 3,
      description: '',
      wardenName: '',
      wardenContact: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (hostel) => {
    setCurrentHostel(hostel);
    setFormData({
      name: hostel.name,
      type: hostel.type,
      location: hostel.location,
      totalFloors: hostel.totalFloors,
      description: hostel.description || '',
      wardenName: hostel.wardenName || '',
      wardenContact: hostel.wardenContact || '',
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (hostel) => {
    setCurrentHostel(hostel);
    setIsDeleteModalOpen(true);
  };

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');
      const res = await hostelService.create(formData);
      if (res.data.success) {
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
        success('Hostel created successfully!');
        setIsAddModalOpen(false);
        fetchHostels();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create hostel';
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateHostel = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');
      const res = await hostelService.update(currentHostel._id, formData);
      if (res.data.success) {
        success('Hostel updated successfully!');
        setIsEditModalOpen(false);
        fetchHostels();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update hostel';
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHostel = async () => {
    try {
      setSubmitting(true);
      const res = await hostelService.delete(currentHostel._id);
      if (res.data.success) {
        success(res.data.message || 'Hostel deleted successfully');
        setIsDeleteModalOpen(false);
        fetchHostels();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete hostel');
    } finally {
      setSubmitting(false);
    }
  };

  const totalHostels = hostels.length;
  const totalCapacity = hostels.reduce((acc, h) => acc + (h.totalCapacity || 0), 0);
  const totalOccupied = hostels.reduce((acc, h) => acc + (h.occupiedBeds || 0), 0);
  const totalVacant = hostels.reduce((acc, h) => acc + (h.availableBeds || 0), 0);
  const avgOccupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1429]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-indigo-500/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-700/60 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-sky-400 animate-spin" />
              CAMPUS RESIDENTIAL DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans flex items-center gap-2.5">
            <img src="/livora-logo.svg" alt="LIVORA" className="w-8 h-8 rounded-xl" />
            <span>Hostel Residences & Facilities</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time residential occupancy, room inventories, and designated warden supervision across university living quarters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="relative z-10 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Commission New Residence</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c1429]/90 backdrop-blur-xl p-5 rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-indigo-400/50 transition-all text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Halls</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalHostels}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Residences</span>
          </div>
        </div>

        <div className="bg-[#0c1429]/90 backdrop-blur-xl p-5 rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-indigo-400/50 transition-all text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Capacity</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalCapacity}</span>
            <span className="text-[11px] text-slate-300 font-medium">Beds</span>
          </div>
        </div>

        <div className="bg-[#0c1429]/90 backdrop-blur-xl p-5 rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-indigo-400/50 transition-all text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vacant Beds</span>
            <DoorOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{totalVacant}</span>
            <span className="text-[11px] text-emerald-300 font-semibold">Available Now</span>
          </div>
        </div>

        <div className="bg-[#0c1429]/90 backdrop-blur-xl p-5 rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-indigo-400/50 transition-all text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Global Occupancy</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-400">{avgOccupancyRate}%</span>
            <span className="text-[11px] text-slate-300">({totalOccupied} Occupants)</span>
          </div>
        </div>
      </div>

      {/* Interactive Category Filter Pills & Search */}
      <div className="bg-[#0c1429]/90 backdrop-blur-xl p-4 rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col md:flex-row gap-3 items-center justify-between text-white">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-indigo-950/70 rounded-2xl w-full md:w-auto border border-indigo-800/50">
          {['All', 'Boys', 'Girls', 'Co-ed'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-indigo-900/50'
              }`}
            >
              <span>{type === 'All' ? 'All Residences' : `${type} Halls`}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hall name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#070e24] border border-indigo-800/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all font-medium text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Hostels Grid with Real Architectural Photos & Shimmer Meters */}
      {loading ? (
        <TableSkeleton rows={3} cols={4} />
      ) : hostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <div
              key={hostel._id}
              className="group bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] hover:border-indigo-400/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between relative text-white"
            >
              {/* Full-width Architectural Cover Photo */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={getHostelImage(hostel.name)}
                  alt={hostel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1429] via-[#0c1429]/40 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge status={hostel.type} />
                </div>
                <div className="absolute bottom-3 left-5 right-5">
                  <h3 className="text-base font-black text-white leading-snug drop-shadow-md group-hover:text-sky-300 transition-colors">
                    {hostel.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{hostel.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-2">
                {hostel.description && (
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 bg-indigo-950/40 p-3 rounded-2xl border border-indigo-900/60 leading-relaxed font-normal">
                    {hostel.description}
                  </p>
                )}

                {/* Occupancy Progress Bar with Shimmer */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>Occupancy</span>
                    </span>
                    <span className="text-white font-bold">
                      {hostel.occupiedBeds} / {hostel.totalCapacity} Beds ({hostel.occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#070e24] h-2.5 rounded-full overflow-hidden p-0.5 border border-indigo-900/70">
                    <div
                      className={`h-full rounded-full transition-all duration-500 progress-shimmer ${
                        hostel.occupancyRate >= 90
                          ? 'bg-rose-500'
                          : hostel.occupancyRate >= 70
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400'
                      }`}
                      style={{ width: `${Math.min(hostel.occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-indigo-950/80 text-center">
                  <div className="bg-indigo-950/50 p-2.5 rounded-2xl border border-indigo-900/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Floors</p>
                    <p className="text-xs font-black text-white mt-0.5">{hostel.totalFloors}</p>
                  </div>
                  <div className="bg-indigo-950/50 p-2.5 rounded-2xl border border-indigo-900/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rooms</p>
                    <p className="text-xs font-black text-white mt-0.5">{hostel.totalRooms}</p>
                  </div>
                  <div className="bg-emerald-500/15 p-2.5 rounded-2xl border border-emerald-500/30">
                    <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Vacant Beds</p>
                    <p className="text-xs font-black text-emerald-300 mt-0.5">{hostel.availableBeds}</p>
                  </div>
                </div>

                {/* Warden contact info pill */}
                {hostel.wardenName && (
                  <div className="mt-3.5 text-[11px] text-slate-300 flex items-center justify-between bg-indigo-950/50 px-3.5 py-2.5 rounded-2xl border border-indigo-900/50">
                    <span className="flex items-center gap-1.5 font-medium truncate">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>{hostel.wardenName}</span>
                    </span>
                    {hostel.wardenContact && (
                      <span className="text-sky-300 font-mono text-[10px] font-semibold">{hostel.wardenContact}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-3.5 bg-[#080f24] border-t border-indigo-950/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate('/admin/rooms')}
                  className="text-xs font-bold text-sky-400 hover:text-white flex items-center gap-1 group/btn transition-colors"
                >
                  <span>Inventory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(hostel)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-blue-600 rounded-xl bg-indigo-950/80 border border-indigo-800/60 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleOpenDelete(hostel)}
                    className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl bg-rose-950/60 border border-rose-800/50 transition-colors shadow-sm"
                    title="Delete Residence"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0c1429]/90 backdrop-blur-xl p-12 text-center rounded-3xl border border-indigo-500/20 shadow-sm text-white">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Hostels Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No hostels match your search criteria. Add your first university residence using the button above.
          </p>
        </div>
      )}

      {/* Add Hostel Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Hostel"
        subtitle="Create a new campus residence building"
      >
        <form onSubmit={handleCreateHostel} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Aryabhatta Boys Hostel"
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="Boys">Boys Hostel</option>
                <option value="Girls">Girls Hostel</option>
                <option value="Co-ed">Co-ed Hostel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Floors *</label>
              <input
                type="number"
                name="totalFloors"
                min="1"
                max="20"
                required
                value={formData.totalFloors}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Location *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. North Campus, Block B"
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warden Name</label>
              <input
                type="text"
                name="wardenName"
                value={formData.wardenName}
                onChange={handleInputChange}
                placeholder="e.g. Dr. K. Sharma"
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warden Phone</label>
              <input
                type="text"
                name="wardenContact"
                value={formData.wardenContact}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Facilities</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Facilities, rules, wifi availability, gym, etc."
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Hostel'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Hostel Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Hostel"
        subtitle={`Update details for ${currentHostel?.name}`}
      >
        <form onSubmit={handleUpdateHostel} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="Boys">Boys Hostel</option>
                <option value="Girls">Girls Hostel</option>
                <option value="Co-ed">Co-ed Hostel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Floors *</label>
              <input
                type="number"
                name="totalFloors"
                min="1"
                max="20"
                required
                value={formData.totalFloors}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Location *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warden Name</label>
              <input
                type="text"
                name="wardenName"
                value={formData.wardenName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warden Phone</label>
              <input
                type="text"
                name="wardenContact"
                value={formData.wardenContact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Facilities</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Hostel"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Are you sure you want to delete {currentHostel?.name}?</p>
              <p className="mt-1 text-slate-300">
                This action will delete the hostel and its associated rooms. Deletion is only permitted if there are zero active student room allocations.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleDeleteHostel}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Yes, Delete Hostel'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageHostels;
