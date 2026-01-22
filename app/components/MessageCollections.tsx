'use client';

import { useState } from 'react';

export interface MessageCollection {
  id: string;
  name: string;
  messages: string[];
  order: number;
}

export type SendMode = 'random' | 'sequential';

interface MessageCollectionsProps {
  collections: MessageCollection[];
  onChange: (collections: MessageCollection[]) => void;
  sendMode: SendMode;
  onSendModeChange: (mode: SendMode) => void;
}

export default function MessageCollections({ collections, onChange, sendMode, onSendModeChange }: MessageCollectionsProps) {
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addCollection = () => {
    const name = newCollectionName.trim() || `Coleção ${collections.length + 1}`;
    const newOrder = collections.length > 0 ? Math.max(...collections.map(c => c.order)) + 1 : 0;
    onChange([
      ...collections,
      { id: generateId(), name, messages: [], order: newOrder }
    ]);
    setNewCollectionName('');
  };

  const moveCollectionUp = (index: number) => {
    if (index === 0) return;
    const newCollections = [...collections];
    [newCollections[index - 1], newCollections[index]] = [newCollections[index], newCollections[index - 1]];
    // Atualiza os orders
    newCollections.forEach((c, i) => c.order = i);
    onChange(newCollections);
  };

  const moveCollectionDown = (index: number) => {
    if (index === collections.length - 1) return;
    const newCollections = [...collections];
    [newCollections[index], newCollections[index + 1]] = [newCollections[index + 1], newCollections[index]];
    // Atualiza os orders
    newCollections.forEach((c, i) => c.order = i);
    onChange(newCollections);
  };

  const removeCollection = (id: string) => {
    onChange(collections.filter(c => c.id !== id));
  };

  const updateCollectionName = (id: string, name: string) => {
    onChange(collections.map(c => c.id === id ? { ...c, name } : c));
  };

  const addMessageToCollection = (collectionId: string) => {
    if (!newMessage.trim()) return;
    
    onChange(collections.map(c => 
      c.id === collectionId 
        ? { ...c, messages: [...c.messages, newMessage.trim()] }
        : c
    ));
    setNewMessage('');
  };

  const removeMessageFromCollection = (collectionId: string, messageIndex: number) => {
    onChange(collections.map(c => 
      c.id === collectionId 
        ? { ...c, messages: c.messages.filter((_, i) => i !== messageIndex) }
        : c
    ));
  };

  const updateMessage = (collectionId: string, messageIndex: number, content: string) => {
    onChange(collections.map(c => 
      c.id === collectionId 
        ? { ...c, messages: c.messages.map((m, i) => i === messageIndex ? content : m) }
        : c
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-gray-800">Coleções de Mensagens</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Nome da coleção"
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={addCollection}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            + Nova Coleção
          </button>
        </div>
      </div>

      {/* Modo de envio */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-blue-800 mb-2">
          Modo de Envio
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="sendMode"
              value="random"
              checked={sendMode === 'random'}
              onChange={() => onSendModeChange('random')}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              🎲 <strong>Aleatório</strong> - Escolhe uma coleção aleatoriamente
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="sendMode"
              value="sequential"
              checked={sendMode === 'sequential'}
              onChange={() => onSendModeChange('sequential')}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              📋 <strong>Sequencial</strong> - Envia na ordem definida (repete)
            </span>
          </label>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          {sendMode === 'random' 
            ? 'A cada intervalo, uma coleção será escolhida aleatoriamente.'
            : 'As coleções serão enviadas na ordem abaixo. Use as setas para reordenar.'}
        </p>
      </div>

      <p className="text-sm text-gray-500">
        Crie coleções de mensagens. Se uma coleção tem múltiplas mensagens, todas serão enviadas em sequência.
      </p>

      {collections.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          Nenhuma coleção criada. Clique em &quot;+ Nova Coleção&quot; para começar.
        </div>
      )}

      <div className="space-y-4">
        {collections.map((collection, index) => (
          <div key={collection.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                {/* Botões de reordenar */}
                {sendMode === 'sequential' && (
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveCollectionUp(index)}
                      disabled={index === 0}
                      className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCollectionDown(index)}
                      disabled={index === collections.length - 1}
                      className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                  </div>
                )}
                
                {/* Número da ordem */}
                {sendMode === 'sequential' && (
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </span>
                )}

                {editingCollection === collection.id ? (
                  <input
                    type="text"
                    value={collection.name}
                    onChange={(e) => updateCollectionName(collection.id, e.target.value)}
                    onBlur={() => setEditingCollection(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingCollection(null)}
                    className="px-2 py-1 border border-gray-300 rounded font-medium"
                    autoFocus
                  />
                ) : (
                  <h4 
                    className="font-medium text-gray-800 cursor-pointer hover:text-blue-600"
                    onClick={() => setEditingCollection(collection.id)}
                    title="Clique para editar"
                  >
                    📁 {collection.name}
                    <span className="text-xs text-gray-400 ml-2">
                      ({collection.messages.length} {collection.messages.length === 1 ? 'mensagem' : 'mensagens'})
                    </span>
                  </h4>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeCollection(collection.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remover
              </button>
            </div>

            {/* Mensagens da coleção */}
            <div className="space-y-2 mb-3">
              {collection.messages.map((message, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <span className="text-xs text-gray-400 mt-2 w-4">{index + 1}.</span>
                  <textarea
                    value={message}
                    onChange={(e) => updateMessage(collection.id, index, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeMessageFromCollection(collection.id, index)}
                    className="text-red-400 hover:text-red-600 text-sm px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Adicionar nova mensagem */}
            <div className="flex gap-2">
              <textarea
                value={editingCollection === collection.id + '-new' ? newMessage : ''}
                onChange={(e) => {
                  setEditingCollection(collection.id + '-new');
                  setNewMessage(e.target.value);
                }}
                onFocus={() => setEditingCollection(collection.id + '-new')}
                placeholder="Digite uma nova mensagem... (HTML: <b>negrito</b>, <i>itálico</i>)"
                rows={2}
                className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm resize-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (editingCollection === collection.id + '-new') {
                    addMessageToCollection(collection.id);
                  }
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm self-end"
              >
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
