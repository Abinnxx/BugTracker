import React from 'react';
import { 
  Bug, 
  Users, 
  BarChart3, 
  Home, 
  Settings,
  Plus,
  Shield
} from 'lucide-react';
import { ViewMode, User } from '../../types';
import { canCreateTickets } from '../../utils/permissions';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onCreateTicket: () => void;
  currentUser: User | null;
}

export function Sidebar({ currentView, onViewChange, onCreateTicket, currentUser }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: Home },
    { id: 'tickets' as ViewMode, label: 'Tickets', icon: Bug },
    { id: 'users' as ViewMode, label: 'Users', icon: Users },
    { id: 'analytics' as ViewMode, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Bug className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">BugTracker</h1>
        </div>
        {currentUser && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Role: </span>
              <span className="text-sm font-medium text-white capitalize">{currentUser.role}</span>
            </div>
          </div>
        )}
      </div>

      {canCreateTickets(currentUser) && (
        <div className="p-4">
          <button
            onClick={onCreateTicket}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      )}

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}