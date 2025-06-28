/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from './importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // If no segments (just /admin), force redirect to professional admin panel
  if (!resolvedParams.segments || resolvedParams.segments.length === 0) {
    const { redirect } = await import('next/navigation');
    redirect('/admin-dashboard');
    return null; // This should never execute due to redirect
  }
  
  // Otherwise, use the default Payload admin interface for collections, etc.
  return RootPage({ config, params, searchParams, importMap });
}

export default Page
