import React from 'react';
import { notFound } from 'next/navigation';
import allPages from '@/data/all_pages.json';
import DocumentView from '@/components/DocumentView';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return allPages
    .filter(p => p.path.startsWith('progreso/'))
    .map(p => ({
      slug: p.path.replace('progreso/', '').split('/'),
    }));
}

export default async function ProgresoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const targetPath = `progreso/${slug.join('/')}`;

  const page = allPages.find(p => p.path === targetPath);
  if (!page) {
    notFound();
  }

  return (
    <DocumentView 
      page={page} 
      sectionTitle="Registro de Progreso & Bitácora" 
      sectionPath="/progreso" 
    />
  );
}
