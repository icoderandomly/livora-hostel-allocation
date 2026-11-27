import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  DoorOpen,
} from 'lucide-react';
import { studentService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';

export const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  // Student Profile Inspection Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAll({
        search: searchTerm || undefined,
        gender: selectedGender || undefined,
      });
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, selectedGender]);

  const handleOpenDetails = async (studentId) => {
    try {
      setDetailLoading(true);
      setIsDetailModalOpen(true);
      const res = await studentService.getById(studentId);
      if (res.data.success) {
        setStudentDetails(res.data);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to fetch student details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleStatus = async (student) => {
    try {
      const res = await studentService.update(student._id, {
        isActive: !student.isActive,
      });
      if (res.data.success) {
        success(`Student account ${!student.isActive ? 'activated' : 'deactivated'}.`);
        fetchStudents();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update student status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            Student Directory
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Registered university students, contact profiles, and room occupancy status.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 rounded-3xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, roll no, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-stone-300">Gender:</span>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="py-1.5 px-3 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400 text-stone-200 font-medium"
          >
            <option value="" className="bg-[#12100e] text-stone-200">All Genders</option>
            <option value="Male" className="bg-[#12100e] text-stone-200">Male</option>
            <option value="Female" className="bg-[#12100e] text-stone-200">Female</option>
            <option value="Other" className="bg-[#12100e] text-stone-200">Other</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0a08]/95 border-b border-stone-800 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Course & Year</th>
                  <th className="py-3.5 px-4">Phone & Gender</th>
                  <th className="py-3.5 px-4">Room Allocation</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/70 text-xs">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-amber-500/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-stone-950 flex items-center justify-center font-black text-xs shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{student.name}</div>
                          <div className="text-[11px] text-stone-400">{student.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">
                      {student.rollNumber || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-200">{student.course || 'N/A'}</div>
                      <div className="text-[11px] text-stone-400">{student.year}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-stone-300">{student.phoneNumber || 'N/A'}</div>
                      <div className="text-[11px] text-stone-400">{student.gender}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {student.activeAllocation ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            {student.activeAllocation.hostel?.name} - Rm{' '}
                            {student.activeAllocation.room?.roomNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-medium text-stone-500">
                          Not Allocated
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetails(student._id)}
                          className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="View Profile & History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(student)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            student.isActive
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-rose-400 hover:bg-rose-500/10'
                          }`}
                          title={student.isActive ? 'Account Active (Click to Deactivate)' : 'Account Inactive (Click to Activate)'}
                        >
                          {student.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Students Found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              No student records matched your search query.
            </p>
          </div>
        )}
      </div>

      {/* Student Profile Inspection Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Student Record & History"
        subtitle={studentDetails?.student?.name}
        maxWidth="max-w-2xl"
      >
        {detailLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading student record...</div>
        ) : studentDetails ? (
          <div className="space-y-5">
            {/* Student Info Card */}
            <div className="p-4 bg-[#0b0a08] rounded-2xl border border-stone-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Name</p>
                <p className="font-bold text-white mt-0.5">{studentDetails.student.name}</p>
                <p className="text-stone-400">{studentDetails.student.email}</p>
                <p className="text-stone-400">{studentDetails.student.phoneNumber}</p>
              </div>

              <div>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Academic Info</p>
                <p className="font-semibold text-stone-200 mt-0.5">
                  Roll No: {studentDetails.student.rollNumber || 'N/A'}
                </p>
                <p className="text-stone-400">{studentDetails.student.course}</p>
                <p className="text-stone-400">{studentDetails.student.year} • {studentDetails.student.gender}</p>
              </div>
            </div>

            {/* Current Active Allocation */}
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Active Room Allocation
              </h4>
              {studentDetails.activeAllocation ? (
                <div className="p-3 bg-[#0b0a08] border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">
                      {studentDetails.activeAllocation.hostel?.name} - Room{' '}
                      {studentDetails.activeAllocation.room?.roomNumber} (
                      {studentDetails.activeAllocation.room?.roomType})
                    </p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">
                      Floor {studentDetails.activeAllocation.room?.floor} • Monthly Fee: ₹
                      {studentDetails.activeAllocation.monthlyFee}
                    </p>
                  </div>
                  <Badge status="Active" />
                </div>
              ) : (
                <div className="p-3 bg-[#0b0a08] border border-stone-800 rounded-2xl text-xs text-stone-400">
                  Student does not currently hold an active room allocation.
                </div>
              )}
            </div>

            {/* Application History */}
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Applications Filed ({studentDetails.applications?.length || 0})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {studentDetails.applications && studentDetails.applications.length > 0 ? (
                  studentDetails.applications.map((app) => (
                    <div
                      key={app._id}
                      className="p-3 bg-[#0b0a08] border border-stone-800 rounded-2xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-amber-400">{app.applicationNumber}</span>
                        <span className="text-stone-300 ml-2">
                          Prefers: {app.preferredHostel?.name} ({app.roomType})
                        </span>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Submitted on {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge status={app.status} />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400">No applications filed yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ManageStudents;
