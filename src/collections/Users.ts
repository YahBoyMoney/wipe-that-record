import { CollectionConfig } from 'payload';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { 
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', 'lastLogin', 'createdAt'],
    description: 'User management and access control'
  },
  access: {
    // Only superadmins can create/update users
    create: ({ req: { user } }) => {
      return user?.role === 'superadmin';
    },
    read: ({ req: { user } }) => {
      // Users can read their own data, superadmins can read all
      if (user?.role === 'superadmin') return true;
      return {
        id: {
          equals: user?.id,
        },
      };
    },
    update: ({ req: { user } }) => {
      // Users can update their own data, superadmins can update all
      if (user?.role === 'superadmin') return true;
      return {
        id: {
          equals: user?.id,
        },
      };
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'superadmin';
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      access: {
        // Only superadmins can change roles
        update: ({ req: { user } }) => user?.role === 'superadmin',
      },
    },
    {
      name: 'department',
      type: 'select',
      options: [
        { label: 'Executive', value: 'executive' },
        { label: 'Sales', value: 'sales' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Operations', value: 'operations' },
        { label: 'Legal', value: 'legal' },
        { label: 'Customer Service', value: 'customer_service' },
      ],
      admin: {
        condition: ({ role }) => ['superadmin', 'admin', 'manager'].includes(role),
      },
    },
    {
      name: 'permissions',
      type: 'array',
      fields: [
        {
          name: 'resource',
          type: 'select',
          options: [
            { label: 'All Access', value: 'all' },
            { label: 'Leads Management', value: 'leads' },
            { label: 'Analytics View', value: 'analytics' },
            { label: 'Email Management', value: 'email' },
            { label: 'Financial Reports', value: 'financial' },
            { label: 'User Management', value: 'users' },
            { label: 'System Settings', value: 'settings' },
          ],
        },
        {
          name: 'actions',
          type: 'array',
          fields: [
            {
              name: 'action',
              type: 'select',
              options: [
                { label: 'Create', value: 'create' },
                { label: 'Read', value: 'read' },
                { label: 'Update', value: 'update' },
                { label: 'Delete', value: 'delete' },
                { label: 'Export', value: 'export' },
              ],
            },
          ],
        },
      ],
      admin: {
        condition: ({ role }) => ['superadmin', 'admin'].includes(role),
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'loginCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        condition: ({ role }) => ['superadmin', 'admin'].includes(role),
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-assign superadmin role to admin@wipethatrecord.com
        if (operation === 'create' && data.email === 'admin@wipethatrecord.com') {
          data.role = 'superadmin';
          data.department = 'executive';
          data.permissions = [
            {
              resource: 'all',
              actions: [
                { action: 'create' },
                { action: 'read' },
                { action: 'update' },
                { action: 'delete' },
                { action: 'export' },
              ],
            },
          ];
          data.isActive = true;
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Update login tracking
        if (operation === 'update' && doc.email) {
          // This would be called from your auth logic
          console.log(`User updated: ${doc.email} (${doc.role})`);
        }
      },
    ],
  },
};

export default Users;