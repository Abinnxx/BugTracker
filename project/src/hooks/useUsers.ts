import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { User } from '../types';

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'admin',
    organizationRole: 'admin',
    permissions: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    role: 'manager',
    organizationRole: 'manager',
    permissions: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alex Chen',
    email: 'alex@company.com',
    role: 'developer',
    organizationRole: 'developer',
    permissions: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    email: 'maria@company.com',
    role: 'qa',
    organizationRole: 'qa',
    permissions: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'viewer',
    organizationRole: 'viewer',
    permissions: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export function useUsers() {
  const [users, setUsers] = useLocalStorage<User[]>('bugTracker_users', defaultUsers);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('bugTracker_currentUser', defaultUsers[0]);

  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      permissions: [],
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [setUsers]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  }, [setUsers]);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  }, [setUsers]);

  const getUserById = useCallback((id: string) => {
    return users.find(user => user.id === id);
  }, [users]);

  return {
    users,
    currentUser,
    setCurrentUser,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
  };
}