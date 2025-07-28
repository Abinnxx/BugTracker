import { User, Permission } from '../types';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    {
      resource: 'tickets',
      actions: ['create', 'read', 'update', 'delete', 'assign']
    },
    {
      resource: 'users',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      resource: 'analytics',
      actions: ['read']
    },
    {
      resource: 'settings',
      actions: ['create', 'read', 'update', 'delete']
    }
  ],
  manager: [
    {
      resource: 'tickets',
      actions: ['create', 'read', 'update', 'assign']
    },
    {
      resource: 'users',
      actions: ['read']
    },
    {
      resource: 'analytics',
      actions: ['read']
    }
  ],
  developer: [
    {
      resource: 'tickets',
      actions: ['read', 'update']
    },
    {
      resource: 'analytics',
      actions: ['read']
    }
  ],
  qa: [
    {
      resource: 'tickets',
      actions: ['create', 'read', 'update']
    },
    {
      resource: 'analytics',
      actions: ['read']
    }
  ],
  viewer: [
    {
      resource: 'tickets',
      actions: ['read']
    },
    {
      resource: 'analytics',
      actions: ['read']
    }
  ]
};

export function hasPermission(
  user: User | null,
  resource: Permission['resource'],
  action: Permission['actions'][0]
): boolean {
  if (!user) return false;
  
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  const resourcePermission = permissions.find(p => p.resource === resource);
  
  return resourcePermission?.actions.includes(action) || false;
}

export function canCreateTickets(user: User | null): boolean {
  return hasPermission(user, 'tickets', 'create');
}

export function canEditTickets(user: User | null): boolean {
  return hasPermission(user, 'tickets', 'update');
}

export function canDeleteTickets(user: User | null): boolean {
  return hasPermission(user, 'tickets', 'delete');
}

export function canAssignTickets(user: User | null): boolean {
  return hasPermission(user, 'tickets', 'assign');
}

export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, 'users', 'update');
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'admin': return 'text-red-600 bg-red-50 border-red-200';
    case 'manager': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'developer': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'qa': return 'text-green-600 bg-green-50 border-green-200';
    case 'viewer': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getRoleHierarchy(): string[] {
  return ['admin', 'manager', 'developer', 'qa', 'viewer'];
}

export function canUserAccessRole(currentUser: User | null, targetRole: string): boolean {
  if (!currentUser) return false;
  
  const hierarchy = getRoleHierarchy();
  const currentIndex = hierarchy.indexOf(currentUser.organizationRole);
  const targetIndex = hierarchy.indexOf(targetRole);
  
  return currentIndex <= targetIndex;
}