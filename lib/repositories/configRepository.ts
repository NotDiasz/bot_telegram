import { prisma } from '../db';
import { BotConfig, Group } from '@prisma/client';

export class ConfigRepository {
  async getConfig(): Promise<(BotConfig & { groups: Group[] }) | null> {
    try {
      const config = await prisma.botConfig.findFirst({
        include: { groups: true },
        orderBy: { createdAt: 'desc' },
      });
      return config;
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      return null;
    }
  }

  async createOrUpdateConfig(data: {
    botToken: string;
    message: string;
    intervalMinutes: number;
    groups: Array<{ chatId: string; name: string }>;
  }): Promise<BotConfig | null> {
    try {
      // Remove configuração anterior
      await prisma.botConfig.deleteMany({});

      // Cria nova configuração
      const config = await prisma.botConfig.create({
        data: {
          botToken: data.botToken,
          message: data.message,
          intervalMinutes: data.intervalMinutes,
          groups: {
            create: data.groups,
          },
        },
        include: { groups: true },
      });

      return config;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return null;
    }
  }

  async updateBotStatus(isActive: boolean): Promise<boolean> {
    try {
      const config = await prisma.botConfig.findFirst();
      if (!config) return false;

      await prisma.botConfig.update({
        where: { id: config.id },
        data: { isActive },
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do bot:', error);
      return false;
    }
  }

  async updateGroupLastSent(chatId: string): Promise<boolean> {
    try {
      await prisma.group.updateMany({
        where: { chatId },
        data: { lastSentAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar última mensagem do grupo:', error);
      return false;
    }
  }

  async getActiveConfig(): Promise<(BotConfig & { groups: Group[] }) | null> {
    try {
      const config = await prisma.botConfig.findFirst({
        where: { isActive: true },
        include: { groups: true },
      });
      return config;
    } catch (error) {
      console.error('Erro ao buscar configuração ativa:', error);
      return null;
    }
  }
}

export const configRepository = new ConfigRepository();
