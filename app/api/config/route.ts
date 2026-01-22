import { NextResponse } from 'next/server';
import { configRepository } from '@/lib/repositories/configRepository';

export async function GET() {
  try {
    const config = await configRepository.getConfig();
    
    if (!config) {
      return NextResponse.json({ config: null }, { status: 200 });
    }

    // Não retornar o token completo por segurança
    const safeConfig = {
      ...config,
      botToken: config.botToken ? '***' + config.botToken.slice(-4) : '',
    };

    return NextResponse.json({ config: safeConfig }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configuração' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { botToken, intervalMinutes, groups, collections } = body;

    // Validações
    if (!botToken || !intervalMinutes || !groups || groups.length === 0) {
      return NextResponse.json(
        { error: 'Token, intervalo e grupos são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!collections || collections.length === 0) {
      return NextResponse.json(
        { error: 'Adicione pelo menos uma coleção de mensagens.' },
        { status: 400 }
      );
    }

    if (intervalMinutes < 1) {
      return NextResponse.json(
        { error: 'Intervalo deve ser maior que 0 minutos' },
        { status: 400 }
      );
    }

    const config = await configRepository.createOrUpdateConfig({
      botToken,
      intervalMinutes: parseInt(intervalMinutes),
      groups,
      collections,
    });

    if (!config) {
      return NextResponse.json(
        { error: 'Erro ao salvar configuração' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Configuração salva com sucesso', config },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar configuração' },
      { status: 500 }
    );
  }
}
