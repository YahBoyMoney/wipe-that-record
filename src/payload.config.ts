import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import sharp from 'sharp';

import Users from './collections/Users';
import Media from './collections/Media';
import Leads from './collections/Leads';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: __dirname },
    components: {
      views: {
        dashboard: {
          Component: './views/AdminDashboard',
        },
      },
    },
    // Add navigation item for dashboard
    meta: {
      titleSuffix: '- Wipe That Record',
      description: 'California expungement service admin panel',
    },
  },

  collections: [
    Users,
    Media,
    Leads,
    // add more here later
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [payloadCloudPlugin()],
}); 