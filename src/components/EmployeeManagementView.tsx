import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Employee, UserRole } from '../types';
import {
  Users,
  UserCheck,
  Plus,
  Phone,
  Briefcase,
  Shield,
  Search,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const EmployeeManagementView: React.FC = () => {
  const { employees, addEmployee, updateEmployeeAttendance, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  // Form
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Driver');
  const [phone, setPhone] = useState('+251 91 ');
  const [department, setDepartment] = useState('Logistics & Fleet');
  const [monthlySalary, setMonthlySalary] = useState<number>(12000);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      fullName,
      role,
      phone,
      department,
      monthlySalary: Number(monthlySalary),
      attendanceStatus: 'PRESENT',
      deliveriesCompleted: role === 'Driver' ? 0 : undefined,
    });
    setFullName('');
    setIsEmployeeModalOpen(false);
  };

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || e.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-[#E41E26]" />
            <span>Staff, Drivers & Role Permissions</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage 30+ distributor personnel, driver trip performance, daily attendance, and payroll records.
          </p>
        </div>

        <button
          onClick={() => setIsEmployeeModalOpen(true)}
          className="bg-[#E41E26] hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search & Role Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name, department, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-medium"
        >
          <option value="ALL">All Roles</option>
          <option value="Administrator">Administrator</option>
          <option value="Manager">Manager</option>
          <option value="Sales Officer">Sales Officer</option>
          <option value="Warehouse Officer">Warehouse Officer</option>
          <option value="Cashier">Cashier</option>
          <option value="Driver">Driver</option>
          <option value="Accountant">Accountant</option>
        </select>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {emp.fullName}
                  </h3>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {emp.role}
                  </span>
                </div>

                <select
                  value={emp.attendanceStatus}
                  onChange={(e) => updateEmployeeAttendance(emp.id, e.target.value as any)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border-none ${
                    emp.attendanceStatus === 'PRESENT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : emp.attendanceStatus === 'ON_LEAVE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                  <option value="ABSENT">ABSENT</option>
                </select>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{emp.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-3.5 h-3.5 text-red-500" />
                  <span>Dept: {emp.department}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Monthly Salary:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {emp.monthlySalary.toLocaleString()} ETB
                  </span>
                </div>

                {emp.role === 'Driver' && emp.deliveriesCompleted !== undefined && (
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Driver Deliveries Done:</span>
                    <span className="font-bold text-red-600">
                      {emp.deliveriesCompleted} Trips Completed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsEmployeeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Register New Employee
            </h3>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ato Tesfaye Gemechu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Role Title
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Driver">Driver</option>
                    <option value="Sales Officer">Sales Officer</option>
                    <option value="Warehouse Officer">Warehouse Officer</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Manager">Manager</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Salary (ETB)
                  </label>
                  <input
                    type="number"
                    required
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E41E26] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow transition"
              >
                Save Employee Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
