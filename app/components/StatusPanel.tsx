'use client';

import { useState, useEffect } from 'react';

interface StatusPanelProps {
  onRefresh: number;
}

export default function StatusPanel({ onRefresh }: StatusPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStatus();
  }, [onRefresh]);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/bot/status');
      const data = await response.json();
      setIsRunning(data.isActive && data.isRunning);
    } catch (err) {
      console.error('Erro ao buscar status:', err);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/bot/start', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao iniciar bot');
        return;
      }

      setSuccess('Bot iniciado com sucesso!');
      setIsRunning(true);
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/bot/stop', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao parar bot');
        return;
      }

      setSuccess('Bot parado com sucesso!');
      setIsRunning(false);
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Controle do Bot
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

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Status:</span>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isRunning
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isRunning ? '🟢 Ativo' : '⚫ Inativo'}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={loading || isRunning}
          className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Processando...' : 'Iniciar Bot'}
        </button>

        <button
          onClick={handleStop}
          disabled={loading || !isRunning}
          className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Processando...' : 'Parar Bot'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Antes de iniciar o bot, certifique-se de ter
          salvo a configuração com o token válido, mensagem e grupos
          selecionados.
        </p>
      </div>
    </div>
  );
}
