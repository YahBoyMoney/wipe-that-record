import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { fileURLToPath } from 'url'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import sharp from 'sharp'

import Users from './src/collections/Users'
import Media from './src/collections/Media'
import Leads from './src/collections/Leads'  
import Products from './src/collections/Products'
import Orders from './src/collections/Orders'
import Analytics from './src/collections/Analytics'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(__dirname, './src') },
    meta: {
      titleSuffix: '- WipeThatRecord E-Commerce',
      description: 'Complete e-commerce management system for California expungement services',
    },
    dateFormat: 'MM/dd/yyyy',
    components: {
      views: {
        Dashboard: {
          Component: '@/views/Dashboard',
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Leads,
    Products,
    Orders,
    Analytics,
  ],
  globals: [
    // Add global settings for site configuration
    {
      slug: 'settings',
      access: {
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
      },
      fields: [
        {
          name: 'siteName',
          type: 'text',
          required: true,
          defaultValue: 'WipeThatRecord',
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          defaultValue: 'Professional California expungement services',
        },
        {
          name: 'contactInfo',
          type: 'group',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'address',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'businessSettings',
          type: 'group',
          fields: [
            {
              name: 'taxRate',
              type: 'number',
              defaultValue: 0.0875,
              admin: {
                step: 0.0001,
                description: 'Tax rate (e.g., 0.0875 for 8.75%)',
              },
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'USD',
              options: [
                { label: 'US Dollar', value: 'USD' },
                { label: 'Euro', value: 'EUR' },
                { label: 'British Pound', value: 'GBP' },
              ],
            },
            {
              name: 'timezone',
              type: 'select',
              defaultValue: 'America/Los_Angeles',
              options: [
                { label: 'Pacific Time', value: 'America/Los_Angeles' },
                { label: 'Mountain Time', value: 'America/Denver' },
                { label: 'Central Time', value: 'America/Chicago' },
                { label: 'Eastern Time', value: 'America/New_York' },
              ],
            },
          ],
        },
        {
          name: 'emailSettings',
          type: 'group',
          fields: [
            {
              name: 'fromName',
              type: 'text',
              defaultValue: 'WipeThatRecord',
            },
            {
              name: 'fromEmail',
              type: 'email',
              required: true,
            },
            {
              name: 'replyToEmail',
              type: 'email',
            },
          ],
        },
      ],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(__dirname, './src/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
  ],
  cors: [
    'http://localhost:3000',
    'https://your-domain.com', // Add your production domain
  ],
  csrf: [
    'http://localhost:3000',
    'https://your-domain.com', // Add your production domain
  ],
}) 