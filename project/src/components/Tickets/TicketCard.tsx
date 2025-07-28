import React from 'react';
import { 
  Clock, 
  User, 
  MessageCircle, 
  AlertTriangle,
  Bug,
  Zap,
  Settings,
  CheckCircle
} from 'lucide-react';
import { Ticket, User as UserType } from '../../types';

interface TicketCardProps {
  ticket: Ticket;
  assignee?: UserType;
  reporter?: UserType;
  commentCount: number;
  onClick: () => void;
}

export function TicketCard({ ticket, assignee, reporter, commentCount, onClick }: TicketCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'testing': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'closed': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Zap className="w-4 h-4" />;
      case 'enhancement': return <Settings className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      default: return <Bug className="w-4 h-4" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-gray-600">
            {getTypeIcon(ticket.type)}
          </div>
          <span className="text-sm text-gray-500">#{ticket.id.slice(-8)}</span>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(ticket.status)}`}>
            {ticket.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {ticket.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {ticket.description}
      </p>

      {ticket.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {ticket.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {assignee && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{assignee.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{commentCount}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}