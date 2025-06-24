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

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(__dirname, './src') },
    components: {
      views: {
        dashboard: {
          Component: './views/SimpleDashboard',
        },
      },
    },
    meta: {
      titleSuffix: '- Wipe That Record',
      description: 'California expungement service admin panel',
    },
  },
  collections: [
    Users,
    Media,
    Leads,
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
  plugins: [payloadCloudPlugin()],
}) 