import { NextResponse } from 'next/server';
import { getTelegramGroups, testTelegramConnection } from '@/lib/services/telegramService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { botToken } = body;

    if (!botToken) {
      return NextResponse.json(
        { error: 'Token do bot é obrigatório' },
        { status: 400 }
      );
    }

    // Testar conexão primeiro
    const isValid = await testTelegramConnection(botToken);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Token inválido ou bot não pode ser acessado' },
        { status: 400 }
      );
    }

    // Buscar grupos
    const groups = await getTelegramGroups(botToken);

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar grupos' },
      { status: 500 }
    );
  }
}
