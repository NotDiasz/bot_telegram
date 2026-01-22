import { NextResponse } from 'next/server';
import { configRepository } from '@/lib/repositories/configRepository';
import { SchedulerService } from '@/lib/services/schedulerService';

export async function GET() {
  try {
    const config = await configRepository.getActiveConfig();
    const isRunning = SchedulerService.isRunning();

    return NextResponse.json(
      {
        isRunning,
        hasConfig: !!config,
        isActive: config?.isActive || false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar status' },
      { status: 500 }
    );
  }
}
