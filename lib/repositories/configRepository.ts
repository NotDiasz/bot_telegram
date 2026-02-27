import { prisma } from '../db';
import { BotConfig, Group, MessageCollection, Message } from '@prisma/client';

type FullConfig = BotConfig & { 
  groups: Group[];
  collections: (MessageCollection & { messages: Message[] })[];
};

export class ConfigRepository {
  async getConfig(): Promise<FullConfig | null> {
    try {
      const config = await prisma.botConfig.findFirst({
        include: { 
          groups: true,
          collections: {
            include: { messages: { orderBy: { order: 'asc' } } }
          }
        },
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
    intervalMinutes: number;
    groups: Array<{ chatId: string; name: string }>;
    collections: Array<{ name: string; messages: string[] }>;
  }): Promise<BotConfig> {
    // Remove configuração anterior
    await prisma.botConfig.deleteMany({});

    // Cria nova configuração
    const config = await prisma.botConfig.create({
      data: {
        botToken: data.botToken,
        intervalMinutes: data.intervalMinutes,
        groups: {
          create: data.groups,
        },
        collections: {
          create: data.collections.map(col => ({
            name: col.name,
            messages: {
              create: col.messages.map((content, index) => ({
                content,
                order: index,
              })),
            },
          })),
        },
      },
      include: {
        groups: true,
        collections: { include: { messages: true } }
      },
    });

    return config;
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

  async getActiveConfig(): Promise<FullConfig | null> {
    try {
      const config = await prisma.botConfig.findFirst({
        where: { isActive: true },
        include: { 
          groups: true,
          collections: {
            include: { messages: { orderBy: { order: 'asc' } } }
          }
        },
      });
      return config;
    } catch (error) {
      console.error('Erro ao buscar configuração ativa:', error);
      return null;
    }
  }

  async getRandomCollection(configId: string): Promise<(MessageCollection & { messages: Message[] }) | null> {
    try {
      const collections = await prisma.messageCollection.findMany({
        where: { configId },
        include: { messages: { orderBy: { order: 'asc' } } },
      });
      
      if (collections.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * collections.length);
      return collections[randomIndex];
    } catch (error) {
      console.error('Erro ao buscar coleção aleatória:', error);
      return null;
    }
  }
}

export const configRepository = new ConfigRepository();
