import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock, BarChart3 } from 'lucide-react';
import { Ticket, User } from '../../types';
import { AnalyticsCharts } from '../Analytics/AnalyticsCharts';
import { generateAnalyticsData } from '../../utils/analytics';

interface AnalyticsProps {
  tickets: Ticket[];
  users: User[];
}

export function Analytics({ tickets, users }: AnalyticsProps) {
  const analyticsData = generateAnalyticsData(tickets, users);
  
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;

  const ticketsByPriority = {
    critical: tickets.filter(t => t.priority === 'critical').length,
    high: tickets.filter(t => t.priority === 'high').length,
    medium: tickets.filter(t => t.priority === 'medium').length,
    low: tickets.filter(t => t.priority === 'low').length,
  };

  const ticketsByType = {
    bug: tickets.filter(t => t.type === 'bug').length,
    feature: tickets.filter(t => t.type === 'feature').length,
    enhancement: tickets.filter(t => t.type === 'enhancement').length,
    task: tickets.filter(t => t.type === 'task').length,
  };

  const userStats = users.map(user => {
    const assignedTickets = tickets.filter(t => t.assigneeId === user.id);
    const completedTickets = assignedTickets.filter(t => t.status === 'closed');
    
    return {
      user,
      assigned: assignedTickets.length,
      completed: completedTickets.length,
      completionRate: assignedTickets.length > 0 
        ? Math.round((completedTickets.length / assignedTickets.length) * 100) 
        : 0,
    };
  });

  const metrics = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Resolution Rate',
      value: totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) + '%' : '0%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Avg. Resolution Time',
      value: '2.3 days',
      change: '-8%',
      trend: 'down',
      icon: Clock,
    },
    {
      title: 'Active Users',
      value: users.filter(u => u.isActive).length,
      change: '0%',
      trend: 'neutral',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
        </div>
        <p className="text-gray-600">Comprehensive performance insights and data visualization</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                ) : null}
                <span className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change} from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Charts */}
      <AnalyticsCharts data={analyticsData} />

      {/* User Performance */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map(({ user, assigned, completed, completionRate }) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 capitalize">{user.role}</td>
                  <td className="py-3 px-4 text-gray-900">{assigned}</td>
                  <td className="py-3 px-4 text-gray-900">{completed}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}