import TelegramBot from 'node-telegram-bot-api';

let botInstance: TelegramBot | null = null;
let currentToken: string | null = null;

export class TelegramService {
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: false });
  }

  static getInstance(token: string): TelegramBot {
    if (!botInstance || currentToken !== token) {
      botInstance = new TelegramBot(token, { polling: false });
      currentToken = token;
    }
    return botInstance;
  }

  async sendMessage(chatId: string, message: string): Promise<boolean> {
    try {
      await this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  }

  async getGroups(): Promise<Array<{ chatId: string; name: string }>> {
    try {
      const updates = await this.bot.getUpdates({ limit: 100 });
      const groups = new Map<string, string>();

      updates.forEach((update) => {
        const chat = update.message?.chat || update.my_chat_member?.chat;
        if (chat && (chat.type === 'group' || chat.type === 'supergroup')) {
          groups.set(chat.id.toString(), chat.title || 'Grupo sem nome');
        }
      });

      return Array.from(groups.entries()).map(([chatId, name]) => ({
        chatId,
        name,
      }));
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      return [];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.bot.getMe();
      return true;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return false;
    }
  }

  async getBotInfo() {
    try {
      return await this.bot.getMe();
    } catch (error) {
      console.error('Erro ao obter informações do bot:', error);
      return null;
    }
  }
}

export async function sendTelegramMessage(
  token: string,
  chatId: string,
  message: string
): Promise<boolean> {
  const bot = TelegramService.getInstance(token);
  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return false;
  }
}

export async function getTelegramGroups(
  token: string
): Promise<Array<{ chatId: string; name: string }>> {
  const bot = TelegramService.getInstance(token);
  try {
    const updates = await bot.getUpdates({ limit: 100 });
    const groups = new Map<string, string>();

    updates.forEach((update) => {
      const chat = update.message?.chat || update.my_chat_member?.chat;
      if (chat && (chat.type === 'group' || chat.type === 'supergroup')) {
        groups.set(chat.id.toString(), chat.title || 'Grupo sem nome');
      }
    });

    return Array.from(groups.entries()).map(([chatId, name]) => ({
      chatId,
      name,
    }));
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    return [];
  }
}

export async function testTelegramConnection(token: string): Promise<boolean> {
  const bot = TelegramService.getInstance(token);
  try {
    await bot.getMe();
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
}
