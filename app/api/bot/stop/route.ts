import { NextResponse } from 'next/server';
import { configRepository } from '@/lib/repositories/configRepository';
import { SchedulerService } from '@/lib/services/schedulerService';

export async function POST() {
  try {
    // Desativar configuração
    await configRepository.updateBotStatus(false);

    // Parar scheduler
    SchedulerService.stopScheduler();

    return NextResponse.json(
      { message: 'Bot parado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao parar bot:', error);
    return NextResponse.json(
      { error: 'Erro ao parar bot' },
      { status: 500 }
    );
  }
}
