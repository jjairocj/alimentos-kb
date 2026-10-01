import React from 'react';
import { notFound } from 'next/navigation';
import allPages from '@/data/all_pages.json';
import DocumentView from '@/components/DocumentView';

export default function EtiquetadoRootPage() {
  const page = allPages.find(p => p.path === 'etiquetado');
  if (!page) {
    notFound();
  }

  return (
    <DocumentView 
      page={page} 
      sectionTitle="Etiquetado Nutricional" 
      sectionPath="/etiquetado" 
    />
  );
}
