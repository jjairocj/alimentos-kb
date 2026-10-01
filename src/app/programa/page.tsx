import React from 'react';
import { notFound } from 'next/navigation';
import allPages from '@/data/all_pages.json';
import DocumentView from '@/components/DocumentView';

export default function ProgramaRootPage() {
  const page = allPages.find(p => p.path === 'programa/plan') || allPages.find(p => p.path === 'programa/modulos');
  if (!page) {
    notFound();
  }

  return (
    <DocumentView 
      page={page} 
      sectionTitle="Programa de Estudio" 
      sectionPath="/modulos" 
    />
  );
}
