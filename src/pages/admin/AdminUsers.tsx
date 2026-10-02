import React, { useState, useEffect } from 'react';
import { Users, Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { User } from '../../types';
import { adminApi } from '../../services/api';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.getUsers();
        setUsers(data.users || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-purple-500/15">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          Registered Accounts <span className="text-purple-400 text-base font-normal">({users.length})</span>
        </h1>
        <p className="text-xs text-slate-400">View customer identities, access roles, and registered credentials</p>
      </div>

      <div className="glass bg-[#121224]/80 rounded-3xl border border-purple-500/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F0F1A] border-b border-purple-500/15 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Account ID</th>
                <th className="p-4">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-purple-950/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-purple-300 font-mono text-xs">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">{u.id}</td>
                  <td className="p-4 text-slate-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
