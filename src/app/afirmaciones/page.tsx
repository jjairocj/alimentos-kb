import React from 'react';
import { notFound } from 'next/navigation';
import allPages from '@/data/all_pages.json';
import DocumentView from '@/components/DocumentView';

export default function AfirmacionesRootPage() {
  const page = allPages.find(p => p.path === 'afirmaciones');
  if (!page) {
    notFound();
  }

  return (
    <DocumentView 
      page={page} 
      sectionTitle="Afirmaciones y Mitos" 
      sectionPath="/mitos" 
    />
  );
}
