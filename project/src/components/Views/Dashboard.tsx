import React from 'react';
import { DashboardStats } from '../Dashboard/DashboardStats';
import { TicketCard } from '../Tickets/TicketCard';
import { Ticket, User } from '../../types';

interface DashboardProps {
  tickets: Ticket[];
  users: User[];
  getTicketComments: (ticketId: string) => any[];
  onTicketClick: (ticket: Ticket) => void;
}

export function Dashboard({ tickets, users, getTicketComments, onTicketClick }: DashboardProps) {
  const recentTickets = tickets
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const criticalTickets = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your bug tracking system</p>
      </div>

      <DashboardStats tickets={tickets} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentTickets.map(ticket => {
              const assignee = users.find(u => u.id === ticket.assigneeId);
              const reporter = users.find(u => u.id === ticket.reporterId);
              const commentCount = getTicketComments(ticket.id).length;

              return (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  assignee={assignee}
                  reporter={reporter}
                  commentCount={commentCount}
                  onClick={() => onTicketClick(ticket)}
                />
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Critical Issues</h2>
          <div className="space-y-4">
            {criticalTickets.length > 0 ? (
              criticalTickets.map(ticket => {
                const assignee = users.find(u => u.id === ticket.assigneeId);
                const reporter = users.find(u => u.id === ticket.reporterId);
                const commentCount = getTicketComments(ticket.id).length;

                return (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    assignee={assignee}
                    reporter={reporter}
                    commentCount={commentCount}
                    onClick={() => onTicketClick(ticket)}
                  />
                );
              })
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-green-800">No critical issues! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}