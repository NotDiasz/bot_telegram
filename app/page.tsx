'use client';

import { useState } from 'react';
import ConfigForm from './components/ConfigForm';
import StatusPanel from './components/StatusPanel';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConfigSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 Bot Telegram Agendador
          </h1>
          <p className="text-lg text-gray-600">
            Configure seu bot para enviar mensagens automaticamente em grupos do Telegram
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ConfigForm onConfigSaved={handleConfigSaved} />
          </div>

          <div>
            <StatusPanel onRefresh={refreshKey} />

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                📋 Como usar
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span>
                    Crie um bot no Telegram com{' '}
                    <a
                      href="https://t.me/botfather"
            target="_blank"
            rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      @BotFather
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <span>
                    Adicione o bot como administrador nos grupos desejados
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span>
                    Envie uma mensagem no grupo (qualquer mensagem) para que o bot
                    possa identificá-lo
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    4
                  </span>
                  <span>
                    Cole o token do bot acima e clique em "Buscar Grupos"
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    5
                  </span>
                  <span>
                    Configure a mensagem, intervalo e salve a configuração
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    6
                  </span>
                  <span>Clique em "Iniciar Bot" para começar os envios!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Desenvolvido com Next.js, Prisma e Telegram Bot API
          </p>
        </footer>
        </div>
      </main>
  );
}
