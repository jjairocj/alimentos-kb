import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [userProgress, modules, concepts, logs] = await Promise.all([
      prisma.userProgress.findUnique({
        where: { id: 'default-user' },
      }),
      prisma.moduleProgress.findMany(),
      prisma.conceptProgress.findMany(),
      prisma.studyLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const completedModules = modules.filter(m => m.isCompleted).map(m => m.moduleCode);
    const studiedConcepts = concepts.filter(c => c.isStudied).map(c => c.conceptPath);
    const masteredConcepts = concepts.filter(c => c.isMastered).map(c => c.conceptPath);

    return NextResponse.json({
      userProgress: userProgress || {
        currentModule: 'm00-como-estudiar-e-investigar',
        currentPath: '/modulos/m00-como-estudiar-e-investigar',
        streakDays: 1,
      },
      completedModules,
      studiedConcepts,
      masteredConcepts,
      totalModulesCompleted: completedModules.length,
      totalConceptsStudied: studiedConcepts.length,
      modulesDetail: modules,
      conceptsDetail: concepts,
      recentLogs: logs,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, moduleCode, conceptPath, isCompleted, isStudied, isMastered, notes, rating, currentPath } = body;

    // 1. Update current viewed path
    if (action === 'visit' && currentPath) {
      const user = await prisma.userProgress.upsert({
        where: { id: 'default-user' },
        update: { currentPath, lastVisit: new Date() },
        create: { id: 'default-user', currentPath, lastVisit: new Date() },
      });
      return NextResponse.json({ success: true, user });
    }

    // 2. Toggle or update Module
    if (action === 'module' && moduleCode) {
      const code = moduleCode.toLowerCase();
      const updated = await prisma.moduleProgress.upsert({
        where: { moduleCode: code },
        update: {
          isCompleted: isCompleted !== undefined ? isCompleted : true,
          completedAt: isCompleted ? new Date() : null,
          notes: notes !== undefined ? notes : undefined,
          rating: rating !== undefined ? rating : undefined,
        },
        create: {
          moduleCode: code,
          isCompleted: isCompleted !== undefined ? isCompleted : true,
          completedAt: isCompleted ? new Date() : null,
          notes: notes || '',
          rating: rating || 0,
        },
      });

      // Also update current module in user
      await prisma.userProgress.upsert({
        where: { id: 'default-user' },
        update: { currentModule: code, lastVisit: new Date() },
        create: { id: 'default-user', currentModule: code },
      });

      return NextResponse.json({ success: true, module: updated });
    }

    // 3. Toggle or update Concept
    if (action === 'concept' && conceptPath) {
      const updated = await prisma.conceptProgress.upsert({
        where: { conceptPath },
        update: {
          isStudied: isStudied !== undefined ? isStudied : true,
          isMastered: isMastered !== undefined ? isMastered : undefined,
          studiedAt: isStudied ? new Date() : null,
          notes: notes !== undefined ? notes : undefined,
        },
        create: {
          conceptPath,
          isStudied: isStudied !== undefined ? isStudied : true,
          isMastered: isMastered || false,
          studiedAt: isStudied ? new Date() : null,
          notes: notes || '',
        },
      });
      return NextResponse.json({ success: true, concept: updated });
    }

    return NextResponse.json({ error: 'Invalid action or payload' }, { status: 400 });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
