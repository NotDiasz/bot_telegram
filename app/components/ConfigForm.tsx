'use client';

import { useState } from 'react';
import MessageCollections, { MessageCollection, SendMode } from './MessageCollections';

interface Group {
  chatId: string;
  name: string;
}

interface ConfigFormProps {
  onConfigSaved: () => void;
}

export default function ConfigForm({ onConfigSaved }: ConfigFormProps) {
  const [botToken, setBotToken] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [collections, setCollections] = useState<MessageCollection[]>([]);
  const [sendMode, setSendMode] = useState<SendMode>('random');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [manualChatId, setManualChatId] = useState('');
  const [manualGroupName, setManualGroupName] = useState('');

  const handleGroupToggle = (chatId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleAddManualGroup = () => {
    if (!manualChatId.trim()) {
      setError('Digite o Chat ID do grupo');
      return;
    }
    
    const chatId = manualChatId.trim();
    const name = manualGroupName.trim() || `Grupo ${chatId}`;
    
    if (availableGroups.some(g => g.chatId === chatId)) {
      setError('Este grupo já foi adicionado');
      return;
    }
    
    setAvailableGroups(prev => [...prev, { chatId, name }]);
    setSelectedGroups(prev => [...prev, chatId]);
    setManualChatId('');
    setManualGroupName('');
    setError('');
    setSuccess('Grupo adicionado com sucesso!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (selectedGroups.length === 0) {
      setError('Selecione pelo menos um grupo');
      setLoading(false);
      return;
    }

    if (collections.length === 0) {
      setError('Adicione pelo menos uma coleção de mensagens');
      setLoading(false);
      return;
    }

    const hasEmptyCollection = collections.some(c => c.messages.length === 0);
    if (hasEmptyCollection) {
      setError('Todas as coleções devem ter pelo menos uma mensagem');
      setLoading(false);
      return;
    }

    const groups = availableGroups
      .filter((g) => selectedGroups.includes(g.chatId))
      .map((g) => ({ chatId: g.chatId, name: g.name }));

    const collectionsData = collections.map((c, index) => ({
      name: c.name,
      messages: c.messages,
      order: c.order ?? index
    }));

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken,
          intervalMinutes,
          groups,
          collections: collectionsData,
          sendMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao salvar configuração');
        return;
      }

      setSuccess('Configuração salva com sucesso! Agora você pode iniciar o bot.');
      onConfigSaved();
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Configuração do Bot
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token do Bot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token do Bot
          </label>
          <input
            type="text"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Obtenha seu token com @BotFather no Telegram
          </p>
        </div>

        {/* Adicionar grupo manualmente */}
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Adicionar Grupo
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Para obter o Chat ID, adicione @RawDataBot ou @getidsbot ao grupo.
          </p>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={manualChatId}
              onChange={(e) => setManualChatId(e.target.value)}
              placeholder="Chat ID (ex: -1001234567890)"
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={manualGroupName}
              onChange={(e) => setManualGroupName(e.target.value)}
              placeholder="Nome do grupo (opcional)"
              className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={handleAddManualGroup}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              + Adicionar Grupo
            </button>
          </div>
        </div>

        {/* Lista de grupos */}
        {availableGroups.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grupos Selecionados
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-white">
              {availableGroups.map((group) => (
                <div key={group.chatId} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={group.chatId}
                      checked={selectedGroups.includes(group.chatId)}
                      onChange={() => handleGroupToggle(group.chatId)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={group.chatId}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {group.name}
                    </label>
                  </div>
                  <span className="text-xs text-gray-400">{group.chatId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coleções de Mensagens */}
        <div className="border-t pt-6">
          <MessageCollections 
            collections={collections} 
            onChange={setCollections}
            sendMode={sendMode}
            onSendModeChange={setSendMode}
          />
        </div>

        {/* Intervalo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intervalo entre envios (minutos)
          </label>
          <input
            type="number"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Number(e.target.value))}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            A cada intervalo, o bot escolhe uma coleção aleatoriamente e envia suas mensagens
          </p>
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Salvando...' : 'Salvar Configuração'}
        </button>
      </form>
    </div>
  );
}
