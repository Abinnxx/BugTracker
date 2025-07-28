import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { User as UserType } from '../../types';
import { getRoleColor } from '../../utils/permissions';

interface UsersViewProps {
  users: UserType[];
}

export function UsersView({ users }: UsersViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">Manage team members and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded border ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>

            <div className="mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded border ${getRoleColor(user.organizationRole)}`}>
                Org: {user.organizationRole}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {user.name}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}