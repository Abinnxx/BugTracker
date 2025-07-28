import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Views/Dashboard';
import { TicketsView } from './components/Views/TicketsView';
import { UsersView } from './components/Views/UsersView';
import { Analytics } from './components/Views/Analytics';
import { TicketForm } from './components/Tickets/TicketForm';
import { TicketDetail } from './components/Tickets/TicketDetail';
import { useTickets } from './hooks/useTickets';
import { useUsers } from './hooks/useUsers';
import { ViewMode, Ticket } from './types';
import { canCreateTickets, canEditTickets, canDeleteTickets } from './utils/permissions';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const {
    tickets,
    addTicket,
    updateTicket,
    deleteTicket,
    addComment,
    getTicketComments,
    getUserById,
  } = useTickets();

  const {
    users,
    currentUser,
    setCurrentUser,
  } = useUsers();

  const handleCreateTicket = () => {
    if (!canCreateTickets(currentUser)) {
      alert('You do not have permission to create tickets.');
      return;
    }
    setShowTicketForm(true);
    setEditingTicket(null);
  };

  const handleTicketSubmit = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTicket) {
      if (!canEditTickets(currentUser)) {
        alert('You do not have permission to edit tickets.');
        return;
      }
      updateTicket(editingTicket.id, ticketData);
    } else {
      if (!canCreateTickets(currentUser)) {
        alert('You do not have permission to create tickets.');
        return;
      }
      addTicket(ticketData);
    }
    setShowTicketForm(false);
    setEditingTicket(null);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleEditTicket = () => {
    if (selectedTicket) {
      if (!canEditTickets(currentUser)) {
        alert('You do not have permission to edit tickets.');
        return;
      }
      setEditingTicket(selectedTicket);
      setShowTicketForm(true);
      setSelectedTicket(null);
    }
  };

  const handleDeleteTicket = () => {
    if (selectedTicket) {
      if (!canDeleteTickets(currentUser)) {
        alert('You do not have permission to delete tickets.');
        return;
      }
      deleteTicket(selectedTicket.id);
      setSelectedTicket(null);
    }
  };

  const handleStatusChange = (status: Ticket['status']) => {
    if (selectedTicket) {
      if (!canEditTickets(currentUser)) {
        alert('You do not have permission to change ticket status.');
        return;
      }
      updateTicket(selectedTicket.id, { status });
      setSelectedTicket({ ...selectedTicket, status });
    }
  };

  const handleAssigneeChange = (assigneeId: string) => {
    if (selectedTicket) {
      if (!canEditTickets(currentUser) && currentUser?.role !== 'manager') {
        alert('You do not have permission to assign tickets.');
        return;
      }
      const newAssigneeId = assigneeId || undefined;
      updateTicket(selectedTicket.id, { assigneeId: newAssigneeId });
      setSelectedTicket({ ...selectedTicket, assigneeId: newAssigneeId });
    }
  };

  const handleAddComment = (content: string) => {
    if (selectedTicket && currentUser) {
      addComment({
        ticketId: selectedTicket.id,
        userId: currentUser.id,
        content,
      });
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            tickets={tickets}
            users={users}
            getTicketComments={getTicketComments}
            onTicketClick={handleTicketClick}
          />
        );
      case 'tickets':
        return (
          <TicketsView
            tickets={tickets}
            users={users}
            getTicketComments={getTicketComments}
            onTicketClick={handleTicketClick}
          />
        );
      case 'users':
        return <UsersView users={users} />;
      case 'analytics':
        return <Analytics tickets={tickets} users={users} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreateTicket={handleCreateTicket}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col">
        <Header
          currentUser={currentUser}
          onUserChange={setCurrentUser}
          users={users}
        />
        
        <main className="flex-1 p-6">
          {renderCurrentView()}
        </main>
      </div>

      {showTicketForm && (
        <TicketForm
          users={users}
          currentUser={currentUser}
          onSubmit={handleTicketSubmit}
          onClose={() => {
            setShowTicketForm(false);
            setEditingTicket(null);
          }}
          initialTicket={editingTicket || undefined}
        />
      )}

      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          comments={getTicketComments(selectedTicket.id)}
          assignee={selectedTicket.assigneeId ? getUserById(selectedTicket.assigneeId) : undefined}
          reporter={getUserById(selectedTicket.reporterId)}
          currentUser={currentUser}
          users={users}
          onClose={() => setSelectedTicket(null)}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
          onAssigneeChange={handleAssigneeChange}
        />
      )}
    </div>
  );
}

export default App;