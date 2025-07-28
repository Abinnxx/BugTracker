export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'qa' | 'viewer';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  organizationRole: 'admin' | 'manager' | 'developer' | 'viewer';
  permissions: Permission[];
}

export interface Permission {
  resource: 'tickets' | 'users' | 'analytics' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete' | 'assign')[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'testing' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'bug' | 'feature' | 'enhancement' | 'task';
  assigneeId?: string;
  reporterId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
}

export interface Activity {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  details: string;
  createdAt: string;
}

export type ViewMode = 'dashboard' | 'tickets' | 'users' | 'analytics';

export interface AnalyticsData {
  ticketsByStatus: { name: string; value: number; color: string }[];
  ticketsByPriority: { name: string; value: number; color: string }[];
  ticketsByType: { name: string; value: number; color: string }[];
  userPerformance: { user: string; resolved: number; assigned: number; completionRate: number }[];
  weeklyTrends: { week: string; created: number; resolved: number; date: string }[];
  monthlyTrends: { month: string; created: number; resolved: number; date: string }[];
  activityHeatmap: { date: string; count: number; day: number; week: number }[];
}