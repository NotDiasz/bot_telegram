'use client';

import { useState, useEffect } from 'react';

interface Group {
  chatId: string;
  name: string;
}

interface ConfigFormProps {
  onConfigSaved: () => void;
}

export default function ConfigForm({ onConfigSaved }: ConfigFormProps) {
  const [botToken, setBotToken] = useState('');
  const [message, setMessage] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [manualChatId, setManualChatId] = useState('');
  const [manualGroupName, setManualGroupName] = useState('');

  const handleFetchGroups = async () => {
    if (!botToken.trim()) {
      setError('Por favor, insira o token do bot primeiro');
      return;
    }

    setLoadingGroups(true);
    setError('');

    try {
      const response = await fetch('/api/bot/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao buscar grupos');
        setAvailableGroups([]);
        return;
      }

      if (data.groups.length === 0) {
        setError(
          'Nenhum grupo encontrado. Certifique-se de que o bot foi adicionado aos grupos e já recebeu mensagens neles.'
        );
      } else {
        setAvailableGroups(data.groups);
        setSuccess('Grupos carregados com sucesso!');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoadingGroups(false);
    }
  };

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
    
    // Verificar se já existe
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

    const groups = availableGroups
      .filter((g) => selectedGroups.includes(g.chatId))
      .map((g) => ({ chatId: g.chatId, name: g.name }));

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken,
          message,
          intervalMinutes,
          groups,
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token do Bot
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={handleFetchGroups}
              disabled={loadingGroups}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loadingGroups ? 'Carregando...' : 'Buscar Grupos'}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Obtenha seu token com @BotFather no Telegram
          </p>
        </div>

        {/* Adicionar grupo manualmente */}
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Adicionar Grupo Manualmente
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Se o bot não encontrou seu grupo automaticamente, adicione pelo Chat ID.
            Para obter o Chat ID, adicione @RawDataBot ao grupo e veja o &quot;chat id&quot;.
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
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        {availableGroups.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione os Grupos
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              {availableGroups.map((group) => (
                <div key={group.chatId} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={group.chatId}
                    checked={selectedGroups.includes(group.chatId)}
                    onChange={() => handleGroupToggle(group.chatId)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={group.chatId}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {group.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite a mensagem que será enviada aos grupos..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Você pode usar formatação HTML: &lt;b&gt;negrito&lt;/b&gt;, &lt;i&gt;itálico&lt;/i&gt;
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intervalo (minutos)
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
            Tempo entre cada envio de mensagem (mínimo: 1 minuto)
          </p>
        </div>

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
