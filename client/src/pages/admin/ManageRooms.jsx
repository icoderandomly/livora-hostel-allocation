import React, { useState, useEffect } from 'react';
import {
  DoorOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Users,
  Building2,
  Layers,
  IndianRupee,
  AlertTriangle,
  User,
  ShieldAlert,
} from 'lucide-react';
import { roomService, hostelService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';

export const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    roomNumber: '',
    hostel: '',
    floor: 1,
    roomType: 'Double',
    capacity: 2,
    monthlyFee: 6000,
    status: 'Available',
    amenities: 'Bed, Study Table, Cupboard, Fan',
    description: '',
  });

  const { success, error: toastError } = useToast();

  const fetchHostels = async () => {
    try {
      const res = await hostelService.getAll();
      if (res.data.success) {
        setHostels(res.data.hostels);
      }
    } catch {}
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await roomService.getAll({
        search: searchTerm || undefined,
        hostel: selectedHostel || undefined,
        roomType: selectedRoomType || undefined,
        status: selectedStatus || undefined,
      });
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [searchTerm, selectedHostel, selectedRoomType, selectedStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-adjust capacity if roomType changes
      if (name === 'roomType') {
        if (value === 'Single') updated.capacity = 1;
        else if (value === 'Double') updated.capacity = 2;
        else if (value === 'Triple') updated.capacity = 3;
      }
      return updated;
    });
    setFormError('');
  };

  const handleOpenAdd = () => {
    const defaultHostelId = hostels.length > 0 ? hostels[0]._id : '';
    setFormData({
      roomNumber: '',
      hostel: defaultHostelId,
      floor: 1,
      roomType: 'Double',
      capacity: 2,
      monthlyFee: 6000,
      status: 'Available',
      amenities: 'Bed, Study Table, Cupboard, Fan',
      description: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setCurrentRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      hostel: room.hostel?._id || room.hostel,
      floor: room.floor,
      roomType: room.roomType,
      capacity: room.capacity,
      monthlyFee: room.monthlyFee,
      status: room.status,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
      description: room.description || '',
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (room) => {
    setCurrentRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');
      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await roomService.create(payload);
      if (res.data.success) {
        success('Room created successfully!');
        setIsAddModalOpen(false);
        fetchRooms();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create room';
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');
      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await roomService.update(currentRoom._id, payload);
      if (res.data.success) {
        success('Room updated successfully!');
        setIsEditModalOpen(false);
        fetchRooms();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update room';
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      setSubmitting(true);
      const res = await roomService.delete(currentRoom._id);
      if (res.data.success) {
        success(res.data.message || 'Room deleted successfully');
        setIsDeleteModalOpen(false);
        fetchRooms();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete room');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1429]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-indigo-500/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <img src="/livora-logo.svg" alt="LIVORA" className="w-8 h-8 rounded-xl" />
            <span>Room Inventory & Capacity Matrix</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Maintain room capacities, floor layouts, amenities, and real-time student allocations.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0c1429]/90 backdrop-blur-xl p-4 rounded-3xl border border-indigo-500/25 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-white">
        <div className="relative">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#070e24] border border-indigo-800/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-white placeholder-slate-500"
          />
        </div>

        <div>
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-800/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-white"
          >
            <option value="" className="bg-[#0c1429] text-white">All Hostels</option>
            {hostels.map((h) => (
              <option key={h._id} value={h._id} className="bg-[#0c1429] text-white">
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-800/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-white"
          >
            <option value="" className="bg-[#0c1429] text-white">All Room Types</option>
            <option value="Single" className="bg-[#0c1429] text-white">Single (1 Bed)</option>
            <option value="Double" className="bg-[#0c1429] text-white">Double (2 Beds)</option>
            <option value="Triple" className="bg-[#0c1429] text-white">Triple (3 Beds)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-800/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-white"
          >
            <option value="" className="bg-[#0c1429] text-white">All Statuses</option>
            <option value="Available" className="bg-[#0c1429] text-white">Available</option>
            <option value="Full" className="bg-[#0c1429] text-white">Full (Occupied)</option>
            <option value="Maintenance" className="bg-[#0c1429] text-white">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl border border-indigo-500/25 shadow-xl overflow-hidden text-white">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : rooms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#080f24] border-b border-indigo-950/90 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Room No.</th>
                  <th className="py-3.5 px-4">Hostel & Floor</th>
                  <th className="py-3.5 px-4">Type & Fee</th>
                  <th className="py-3.5 px-4">Occupancy Status</th>
                  <th className="py-3.5 px-4">Current Occupants</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/70 text-xs">
                {rooms.map((room) => {
                  const isFull = room.currentOccupancy >= room.capacity;
                  return (
                    <tr key={room._id} className="hover:bg-indigo-950/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-950 text-sky-400 flex items-center justify-center font-bold border border-indigo-800/60">
                            <DoorOpen className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900">{room.roomNumber}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{room.hostel?.name || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">Floor {room.floor}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700">{room.roomType}</div>
                        <div className="text-[11px] text-brand-600 font-semibold flex items-center">
                          ₹{room.monthlyFee?.toLocaleString()}/mo
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge status={room.status} />
                          <span className="text-[11px] font-semibold text-slate-600">
                            {room.currentOccupancy}/{room.capacity} beds
                          </span>
                        </div>
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isFull ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${(room.currentOccupancy / room.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {room.occupants && room.occupants.length > 0 ? (
                          <div className="space-y-0.5">
                            {room.occupants.map((occ) => (
                              <div
                                key={occ._id}
                                className="text-[11px] text-slate-700 flex items-center gap-1.5"
                              >
                                <User className="w-3 h-3 text-slate-400" />
                                <span className="font-medium">{occ.student?.name}</span>
                                <span className="text-slate-400 text-[10px]">
                                  ({occ.student?.rollNumber})
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium">
                            Vacant (Ready to Allocate)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(room)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Room"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(room)}
                            disabled={room.currentOccupancy > 0}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title={
                              room.currentOccupancy > 0
                                ? 'Cannot delete occupied room'
                                : 'Delete Room'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <DoorOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Rooms Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No rooms match your search or filter settings. Click "Add New Room" above to register one.
            </p>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Room"
        subtitle="Configure room number, capacity, and rate"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel *</label>
              <select
                name="hostel"
                required
                value={formData.hostel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                {hostels.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name} ({h.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room Number *</label>
              <input
                type="text"
                name="roomNumber"
                required
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="e.g. A-101"
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Floor *</label>
              <input
                type="number"
                name="floor"
                min="0"
                required
                value={formData.floor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room Type *</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="Single">Single (1 Bed)</option>
                <option value="Double">Double (2 Beds)</option>
                <option value="Triple">Triple (3 Beds)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Capacity *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                max="10"
                required
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Fee (₹) *</label>
              <input
                type="number"
                name="monthlyFee"
                min="0"
                required
                value={formData.monthlyFee}
                onChange={handleInputChange}
                placeholder="e.g. 6000"
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="Available">Available</option>
                <option value="Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Amenities (comma separated)</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              placeholder="Bed, Study Desk, Cupboard, AC, Balcony"
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
              {submitting ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Room"
        subtitle={`Update room ${currentRoom?.roomNumber}`}
      >
        <form onSubmit={handleUpdateRoom} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room Number *</label>
              <input
                type="text"
                name="roomNumber"
                required
                value={formData.roomNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Floor *</label>
              <input
                type="number"
                name="floor"
                min="0"
                required
                value={formData.floor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room Type</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                min={currentRoom?.currentOccupancy || 1}
                max="10"
                required
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Fee (₹) *</label>
            <input
              type="number"
              name="monthlyFee"
              min="0"
              required
              value={formData.monthlyFee}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Amenities</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
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
        title="Confirm Delete Room"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                Delete Room {currentRoom?.roomNumber} from {currentRoom?.hostel?.name}?
              </p>
              <p className="mt-1 text-slate-300">
                This room can only be deleted if there are currently zero active occupants.
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
              onClick={handleDeleteRoom}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Yes, Delete Room'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageRooms;
