import React from 'react';
import { notFound } from 'next/navigation';
import allPages from '@/data/all_pages.json';
import DocumentView from '@/components/DocumentView';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return allPages
    .filter(p => p.path.startsWith('regulacion/'))
    .map(p => ({
      slug: p.path.replace('regulacion/', '').split('/'),
    }));
}

export default async function RegulacionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const targetPath = `regulacion/${slug.join('/')}`;

  const page = allPages.find(p => p.path === targetPath);
  if (!page) {
    notFound();
  }

  return (
    <DocumentView 
      page={page} 
      sectionTitle="Marco Regulatorio Comparado" 
      sectionPath="/regulacion" 
    />
  );
}
