import React from 'react';
import { Bug, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Ticket } from '../../types';

interface DashboardStatsProps {
  tickets: Ticket[];
}

export function DashboardStats({ tickets }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Open Tickets',
      value: tickets.filter(t => t.status === 'open').length,
      icon: Bug,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'In Progress',
      value: tickets.filter(t => t.status === 'in-progress').length,
      icon: Clock,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Closed',
      value: tickets.filter(t => t.status === 'closed').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Critical',
      value: tickets.filter(t => t.priority === 'critical').length,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}