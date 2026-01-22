import { NextResponse } from 'next/server';
import { configRepository } from '@/lib/repositories/configRepository';
import { SchedulerService } from '@/lib/services/schedulerService';

export async function POST() {
  try {
    const config = await configRepository.getConfig();

    if (!config) {
      return NextResponse.json(
        { error: 'Nenhuma configuração encontrada. Configure o bot primeiro.' },
        { status: 400 }
      );
    }

    // Ativar configuração
    await configRepository.updateBotStatus(true);

    // Iniciar scheduler
    SchedulerService.startScheduler();

    return NextResponse.json(
      { message: 'Bot iniciado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao iniciar bot:', error);
    return NextResponse.json(
      { error: 'Erro ao iniciar bot' },
      { status: 500 }
    );
  }
}
