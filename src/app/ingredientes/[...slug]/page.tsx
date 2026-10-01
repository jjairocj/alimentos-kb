import React from 'react';
import { notFound } from 'next/navigation';
import allPages from '@/data/all_pages.json';
import DocumentView from '@/components/DocumentView';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return allPages
    .filter(p => p.path.startsWith('ingredientes/'))
    .map(p => ({
      slug: p.path.replace('ingredientes/', '').split('/'),
    }));
}

export default async function IngredientDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const targetPath = `ingredientes/${slug.join('/')}`;

  const page = allPages.find(p => p.path === targetPath || p.path === `ingredientes/${slug[slug.length - 1]}`);
  if (!page) {
    notFound();
  }

  const isCategory = slug[0] === 'categorias';

  return (
    <DocumentView 
      page={page} 
      sectionTitle={isCategory ? "Categorías de Ingredientes" : "Monografías Toxicológicas"} 
      sectionPath="/ingredientes" 
    />
  );
}
