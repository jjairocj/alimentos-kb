import React from 'react';
import { notFound } from 'next/navigation';
import allPages from '@/data/all_pages.json';
import DocumentView from '@/components/DocumentView';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return allPages
    .filter(p => p.path.startsWith('afirmaciones/'))
    .map(p => ({
      slug: p.path.replace('afirmaciones/', '').split('/'),
    }));
}

export default async function AfirmacionesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const targetPath = `afirmaciones/${slug.join('/')}`;

  const page = allPages.find(p => p.path === targetPath);
  if (!page) {
    notFound();
  }

  return (
    <DocumentView 
      page={page} 
      sectionTitle="Evaluación de Afirmaciones" 
      sectionPath="/mitos" 
    />
  );
}
