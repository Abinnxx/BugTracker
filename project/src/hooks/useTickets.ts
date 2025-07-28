import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Ticket, Comment, Activity, User } from '../types';

export function useTickets() {
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('bugTracker_tickets', []);
  const [comments, setComments] = useLocalStorage<Comment[]>('bugTracker_comments', []);
  const [activities, setActivities] = useLocalStorage<Activity[]>('bugTracker_activities', []);
  const [users] = useLocalStorage<User[]>('bugTracker_users', []);

  const addTicket = useCallback((ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [...prev, newTicket]);
    return newTicket;
  }, [setTickets]);

  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    ));
  }, [setTickets]);

  const deleteTicket = useCallback((id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
    setComments(prev => prev.filter(comment => comment.ticketId !== id));
    setActivities(prev => prev.filter(activity => activity.ticketId !== id));
  }, [setTickets, setComments, setActivities]);

  const addComment = useCallback((comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
    return newComment;
  }, [setComments]);

  const getTicketComments = useCallback((ticketId: string) => {
    return comments.filter(comment => comment.ticketId === ticketId);
  }, [comments]);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [...prev, newActivity]);
  }, [setActivities]);

  const getUserById = useCallback((id: string) => {
    return users.find(user => user.id === id);
  }, [users]);

  return {
    tickets,
    comments,
    activities,
    addTicket,
    updateTicket,
    deleteTicket,
    addComment,
    getTicketComments,
    addActivity,
    getUserById,
  };
}