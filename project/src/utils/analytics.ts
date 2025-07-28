import { Ticket, User, AnalyticsData } from '../types';
import { format, subWeeks, subMonths, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns';

export function generateAnalyticsData(tickets: Ticket[], users: User[]): AnalyticsData {
  const now = new Date();
  
  // Tickets by status
  const statusCounts = {
    open: tickets.filter(t => t.status === 'open').length,
    'in-progress': tickets.filter(t => t.status === 'in-progress').length,
    testing: tickets.filter(t => t.status === 'testing').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  const ticketsByStatus = [
    { name: 'Open', value: statusCounts.open, color: '#3B82F6' },
    { name: 'In Progress', value: statusCounts['in-progress'], color: '#8B5CF6' },
    { name: 'Testing', value: statusCounts.testing, color: '#F59E0B' },
    { name: 'Closed', value: statusCounts.closed, color: '#10B981' },
  ].filter(item => item.value > 0);

  // Tickets by priority
  const priorityCounts = {
    critical: tickets.filter(t => t.priority === 'critical').length,
    high: tickets.filter(t => t.priority === 'high').length,
    medium: tickets.filter(t => t.priority === 'medium').length,
    low: tickets.filter(t => t.priority === 'low').length,
  };

  const ticketsByPriority = [
    { name: 'Critical', value: priorityCounts.critical, color: '#EF4444' },
    { name: 'High', value: priorityCounts.high, color: '#F97316' },
    { name: 'Medium', value: priorityCounts.medium, color: '#EAB308' },
    { name: 'Low', value: priorityCounts.low, color: '#22C55E' },
  ].filter(item => item.value > 0);

  // Tickets by type
  const typeCounts = {
    bug: tickets.filter(t => t.type === 'bug').length,
    feature: tickets.filter(t => t.type === 'feature').length,
    enhancement: tickets.filter(t => t.type === 'enhancement').length,
    task: tickets.filter(t => t.type === 'task').length,
  };

  const ticketsByType = [
    { name: 'Bug', value: typeCounts.bug, color: '#EF4444' },
    { name: 'Feature', value: typeCounts.feature, color: '#8B5CF6' },
    { name: 'Enhancement', value: typeCounts.enhancement, color: '#06B6D4' },
    { name: 'Task', value: typeCounts.task, color: '#84CC16' },
  ].filter(item => item.value > 0);

  // User performance
  const userPerformance = users.map(user => {
    const assignedTickets = tickets.filter(t => t.assigneeId === user.id);
    const resolvedTickets = assignedTickets.filter(t => t.status === 'closed');
    const completionRate = assignedTickets.length > 0 
      ? Math.round((resolvedTickets.length / assignedTickets.length) * 100) 
      : 0;

    return {
      user: user.name,
      resolved: resolvedTickets.length,
      assigned: assignedTickets.length,
      completionRate,
    };
  }).filter(user => user.assigned > 0);

  // Weekly trends (last 12 weeks)
  const weeklyTrends = eachWeekOfInterval({
    start: subWeeks(now, 11),
    end: now
  }).map(weekStart => {
    const weekEnd = endOfWeek(weekStart);
    const weekTickets = tickets.filter(t => {
      const createdAt = new Date(t.createdAt);
      return createdAt >= weekStart && createdAt <= weekEnd;
    });
    const resolvedTickets = tickets.filter(t => {
      const updatedAt = new Date(t.updatedAt);
      return t.status === 'closed' && updatedAt >= weekStart && updatedAt <= weekEnd;
    });

    return {
      week: format(weekStart, 'MMM dd'),
      created: weekTickets.length,
      resolved: resolvedTickets.length,
      date: weekStart.toISOString(),
    };
  });

  // Monthly trends (last 12 months)
  const monthlyTrends = eachMonthOfInterval({
    start: subMonths(now, 11),
    end: now
  }).map(monthStart => {
    const monthEnd = endOfMonth(monthStart);
    const monthTickets = tickets.filter(t => {
      const createdAt = new Date(t.createdAt);
      return createdAt >= monthStart && createdAt <= monthEnd;
    });
    const resolvedTickets = tickets.filter(t => {
      const updatedAt = new Date(t.updatedAt);
      return t.status === 'closed' && updatedAt >= monthStart && updatedAt <= monthEnd;
    });

    return {
      month: format(monthStart, 'MMM yyyy'),
      created: monthTickets.length,
      resolved: resolvedTickets.length,
      date: monthStart.toISOString(),
    };
  });

  // Activity heatmap (last 365 days)
  const activityHeatmap = eachDayOfInterval({
    start: subDays(now, 364),
    end: now
  }).map((date, index) => {
    const dayTickets = tickets.filter(t => {
      const createdAt = new Date(t.createdAt);
      return format(createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });

    return {
      date: format(date, 'yyyy-MM-dd'),
      count: dayTickets.length,
      day: index % 7,
      week: Math.floor(index / 7),
    };
  });

  return {
    ticketsByStatus,
    ticketsByPriority,
    ticketsByType,
    userPerformance,
    weeklyTrends,
    monthlyTrends,
    activityHeatmap,
  };
}