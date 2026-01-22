import * as cron from 'node-cron';
import { configRepository } from '../repositories/configRepository';
import { sendTelegramMessage } from './telegramService';

let scheduledTask: cron.ScheduledTask | null = null;

export class SchedulerService {
  static startScheduler() {
    if (scheduledTask) {
      console.log('Scheduler já está rodando');
      return;
    }

    // Verifica a cada minuto se há mensagens para enviar
    scheduledTask = cron.schedule('* * * * *', async () => {
      await this.checkAndSendMessages();
    });

    console.log('Scheduler iniciado');
  }

  static stopScheduler() {
    if (scheduledTask) {
      scheduledTask.stop();
      scheduledTask = null;
      console.log('Scheduler parado');
    }
  }

  static async checkAndSendMessages() {
    try {
      const config = await configRepository.getActiveConfig();

      if (!config) {
        console.log('Nenhuma configuração ativa encontrada');
        return;
      }

      if (!config.collections || config.collections.length === 0) {
        console.log('Nenhuma coleção de mensagens configurada');
        return;
      }

      const now = new Date();

      for (const group of config.groups) {
        const shouldSend = this.shouldSendMessage(
          group.lastSentAt,
          config.intervalMinutes,
          now
        );

        if (shouldSend) {
          // Escolhe uma coleção aleatória
          const collection = await configRepository.getRandomCollection(config.id);
          
          if (!collection || collection.messages.length === 0) {
            console.log('Nenhuma mensagem encontrada na coleção');
            continue;
          }

          console.log(`Enviando coleção "${collection.name}" para ${group.name} (${group.chatId})`);
          
          // Envia todas as mensagens da coleção em sequência
          let allSuccess = true;
          for (const message of collection.messages) {
            const success = await sendTelegramMessage(
              config.botToken,
              group.chatId,
              message.content
            );
            
            if (!success) {
              allSuccess = false;
              console.error(`Erro ao enviar mensagem para ${group.name}`);
            }
            
            // Pequeno delay entre mensagens (500ms)
            if (collection.messages.length > 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }

          if (allSuccess) {
            await configRepository.updateGroupLastSent(group.chatId);
            console.log(`Coleção "${collection.name}" enviada com sucesso para ${group.name}`);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar e enviar mensagens:', error);
    }
  }

  private static shouldSendMessage(
    lastSentAt: Date | null,
    intervalMinutes: number,
    now: Date
  ): boolean {
    if (!lastSentAt) {
      return true; // Nunca enviou, enviar agora
    }

    const diffInMs = now.getTime() - lastSentAt.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);

    return diffInMinutes >= intervalMinutes;
  }

  static isRunning(): boolean {
    return scheduledTask !== null;
  }
}
