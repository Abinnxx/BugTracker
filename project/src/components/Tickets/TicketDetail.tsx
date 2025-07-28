import React, { useState } from 'react';
import { 
  X, 
  Edit, 
  Trash2, 
  User, 
  Clock, 
  MessageCircle,
  Send,
  Bug,
  Zap,
  Settings,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Ticket, Comment, User as UserType } from '../../types';
import { canEditTickets, canDeleteTickets, canAssignTickets, getRoleColor } from '../../utils/permissions';

interface TicketDetailProps {
  ticket: Ticket;
  comments: Comment[];
  assignee?: UserType;
  reporter?: UserType;
  currentUser: UserType | null;
  users: UserType[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Ticket['status']) => void;
  onAddComment: (content: string) => void;
  onAssigneeChange: (assigneeId: string) => void;
}

export function TicketDetail({
  ticket,
  comments,
  assignee,
  reporter,
  currentUser,
  users,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onAddComment,
  onAssigneeChange
}: TicketDetailProps) {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="w-5 h-5" />;
      case 'feature': return <Zap className="w-5 h-5" />;
      case 'enhancement': return <Settings className="w-5 h-5" />;
      case 'task': return <CheckCircle className="w-5 h-5" />;
      default: return <Bug className="w-5 h-5" />;
    }
  };

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
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'testing': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-gray-600">
                {getTypeIcon(ticket.type)}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                #{ticket.id.slice(-8)} - {ticket.title}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {canEditTickets(currentUser) && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {canDeleteTickets(currentUser) && (
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {ticket.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comments ({comments.length})</span>
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                {comments.map((comment) => {
                  const commentUser = users.find(u => u.id === comment.userId);
                  return (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {commentUser?.name || 'Unknown User'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap ml-8">
                        {comment.content}
                      </p>
                    </div>
                  );
                })}
              </div>

              {currentUser && (
                <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              {canEditTickets(currentUser) ? (
                <select
                  value={ticket.status}
                  onChange={(e) => onStatusChange(e.target.value as Ticket['status'])}
                  className={`w-full px-3 py-2 rounded-md border-0 text-sm font-medium ${getStatusColor(ticket.status)}`}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="testing">Testing</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <div className={`px-3 py-2 rounded-md text-sm font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
              <div className={`px-3 py-2 rounded border text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Assignee</h3>
              {canAssignTickets(currentUser) ? (
                <select
                  value={ticket.assigneeId || ''}
                  onChange={(e) => onAssigneeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Unassigned</option>
                  {users.filter(user => user.isActive).map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-900">
                    {assignee?.name || 'Unassigned'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Reporter</h3>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-900">{reporter?.name || 'Unknown'}</div>
                  {reporter && (
                    <div className={`inline-block px-2 py-1 text-xs rounded border ${getRoleColor(reporter.role)}`}>
                      {reporter.role}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Dates</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
                {ticket.dueDate && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(ticket.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {(ticket.estimatedHours || ticket.actualHours) && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Time Tracking</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {ticket.estimatedHours && (
                    <div>Estimated: {ticket.estimatedHours}h</div>
                  )}
                  {ticket.actualHours && (
                    <div>Actual: {ticket.actualHours}h</div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Permissions</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span>Can edit: {canEditTickets(currentUser) ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span>Can assign: {canAssignTickets(currentUser) ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}