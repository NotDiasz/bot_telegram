# 🤖 Bot Telegram Agendador

Um sistema completo para agendar e enviar mensagens automaticamente em grupos do Telegram através de uma interface web intuitiva.

## 📋 Características

- **Interface Web Moderna**: Construída com Next.js 14 e Tailwind CSS
- **Agendamento Automático**: Envio de mensagens em intervalos configuráveis
- **Múltiplos Grupos**: Suporte para enviar mensagens em vários grupos simultaneamente
- **Fácil Configuração**: Interface intuitiva para configurar o bot
- **Banco de Dados**: Persistência de configurações com Prisma + SQLite

## 🚀 Tecnologias Utilizadas

- **Frontend/Backend**: Next.js 14 (App Router)
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Prisma ORM + SQLite (dev) / PostgreSQL (produção)
- **Bot**: node-telegram-bot-api
- **Agendamento**: node-cron
- **Linguagem**: TypeScript

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd bot_telegram
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma db push
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse http://localhost:3000

## 🔧 Configuração do Bot

### 1. Criar Bot no Telegram

1. Abra o Telegram e procure por [@BotFather](https://t.me/botfather)
2. Envie o comando `/newbot`
3. Siga as instruções para criar seu bot
4. Copie o token fornecido (formato: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Adicionar Bot aos Grupos

1. Adicione o bot como **administrador** nos grupos desejados
2. Certifique-se de que o bot tem permissão para **enviar mensagens**
3. Envie uma mensagem qualquer no grupo (isso permite que o bot o identifique)

### 3. Configurar na Interface Web

1. Cole o token do bot no campo apropriado
2. Clique em "Buscar Grupos" para listar os grupos disponíveis
3. Selecione os grupos onde deseja enviar mensagens
4. Configure a mensagem (suporta formatação HTML)
5. Defina o intervalo de envio (em minutos)
6. Clique em "Salvar Configuração"
7. Clique em "Iniciar Bot" para começar os envios automáticos

## 📝 Formatação de Mensagens

Você pode usar tags HTML para formatar suas mensagens:

- `<b>texto</b>` - **Negrito**
- `<i>texto</i>` - *Itálico*
- `<u>texto</u>` - <u>Sublinhado</u>
- `<code>texto</code>` - `Código`
- `<a href="url">texto</a>` - [Link](url)

## 🏗️ Estrutura do Projeto

```
bot_telegram/
├── app/
│   ├── api/                  # API Routes
│   │   ├── bot/
│   │   │   ├── start/       # Iniciar bot
│   │   │   ├── stop/        # Parar bot
│   │   │   ├── groups/      # Listar grupos
│   │   │   └── status/      # Status do bot
│   │   └── config/          # Configurações
│   ├── components/          # Componentes React
│   │   ├── ConfigForm.tsx
│   │   └── StatusPanel.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts               # Prisma client
│   ├── repositories/       # Camada de dados
│   │   └── configRepository.ts
│   └── services/           # Lógica de negócio
│       ├── telegramService.ts
│       └── schedulerService.ts
├── prisma/
│   └── schema.prisma       # Schema do banco
└── package.json
```

## 🚀 Deploy

### Railway (Recomendado)

1. Crie uma conta no [Railway](https://railway.app)
2. Conecte seu repositório GitHub
3. Railway detectará o Next.js automaticamente
4. Adicione um addon PostgreSQL
5. Deploy automático!

### Render

1. Crie uma conta no [Render](https://render.com)
2. Conecte seu repositório
3. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Adicione um PostgreSQL database
5. Configure a variável `DATABASE_URL`

### Variáveis de Ambiente (Produção)

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

## 🔒 Segurança

- O token do bot nunca é exposto completamente na interface
- Validação de entrada em todas as APIs
- Rate limiting recomendado para produção

## 🐛 Troubleshooting

### Bot não encontra grupos

- Certifique-se de que o bot foi adicionado como administrador
- Envie uma mensagem no grupo para que o bot possa detectá-lo
- Verifique se o token está correto

### Mensagens não estão sendo enviadas

- Verifique se o bot está ativo (status "Ativo")
- Certifique-se de que o intervalo já passou desde o último envio
- Verifique os logs do servidor para erros

### Erro ao conectar com o banco de dados

- Em desenvolvimento: verifique se o arquivo `dev.db` existe
- Em produção: verifique a variável `DATABASE_URL`

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Next.js, Prisma e Telegram Bot API
