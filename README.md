# Minha Saude Feminina

Aplicativo de saude feminina completo com acompanhamento de ciclo menstrual, predicoes, registro de sintomas, lembretes e conteudo educativo. Composto por um app mobile (Ionic/Angular), um painel administrativo (Angular Material) e uma API backend (Laravel).

> Para instrucoes de instalacao e execucao, consulte o arquivo [SETUP.md](./SETUP.md).

## Arquitetura

```
saude-feminina-app/
|-- src/              # App mobile (Ionic + Angular)
|-- admin/            # Painel administrativo (Angular Material)
|-- backend/          # API REST (Laravel 11 + SQLite)
|-- android/          # Build Android (Capacitor)
```

## Funcionalidades

### App Mobile

- **Dashboard (Tab 1):** visao geral do ciclo atual, fase, dias ate proxima menstruacao, janela fertil e proximos lembretes
- **Calendario (Tab 2):** calendario interativo com marcacao dia a dia de menstruacao, lembretes e anotacoes; suporte a multiplos eventos por dia
- **Conteudos (Tab 3):** artigos de saude organizados por categoria
- **Perfil (Tab 4):** informacoes da usuario e configuracoes

### Painel Administrativo

- CRUD de artigos com editor rich text (Quill) e suporte a imagens/videos inline
- Gerenciamento de categorias, tags e fases de vida
- Upload de imagem de capa com validacao de tipo e tamanho

### API Backend

- Gestao de artigos, categorias, tags e fases de vida
- Registro e predicao de ciclo menstrual (baseado em dias marcados)
- Registro de sintomas com intensidade
- Eventos de calendario (menstruacao, lembretes, anotacoes)
- Predicoes inteligentes: proxima menstruacao, janela fertil, fase atual

## Endpoints da API

### Saude / Ciclo

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/predictions` | Predicoes do ciclo (fase, proxima menstruacao, janela fertil) |
| GET/POST/PUT/DELETE | `/api/cycles` | CRUD de ciclos (sistema legado) |
| POST | `/api/calendar-events/toggle-menstruation` | Marcar/desmarcar dia de menstruacao |
| GET | `/api/calendar-events-reminders/upcoming` | Proximos 5 lembretes |
| GET/POST/PUT/DELETE | `/api/calendar-events` | CRUD de eventos (menstruation, reminder, note) |

### Sintomas

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/symptoms` | Lista sintomas disponiveis |
| GET/POST/PUT/DELETE | `/api/symptom-logs` | Registro de sintomas |

### Conteudo

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/articles` | Artigos publicados (com filtros) |
| GET/POST/PUT/DELETE | `/api/admin/articles` | CRUD admin de artigos |
| GET/POST/PUT/DELETE | `/api/categories` | Categorias |
| GET/POST/PUT/DELETE | `/api/tags` | Tags |
| GET/POST/PUT/DELETE | `/api/life-phases` | Fases de vida |

### Utilitario

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/health` | Health check |

## Tecnologias

| Componente | Stack |
|-----------|-------|
| App Mobile | Ionic 8, Angular 20, Capacitor 8, TypeScript, SCSS |
| Admin | Angular 18, Angular Material, ngx-quill, TypeScript |
| Backend | Laravel 11, PHP 8.2, SQLite, Eloquent ORM |
| Build Mobile | Capacitor (Android) |

## Estrutura do Banco de Dados

| Tabela | Descricao |
|--------|-----------|
| `categories` | Categorias de artigos |
| `tags` | Tags para artigos |
| `life_phases` | Fases de vida (adolescencia, gravidez, menopausa, etc.) |
| `articles` | Artigos de saude (com status published/draft) |
| `article_tag` | Relacao N:N artigos-tags |
| `menstrual_cycles` | Ciclos menstruais (sistema legado) |
| `calendar_events` | Eventos de calendario (menstruation, reminder, note) |
| `symptoms` | Sintomas disponiveis |
| `symptom_logs` | Registros diarios de sintomas |

## Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Rosa | `#e94b6a` | Cor primaria, menstruacao |
| Roxo | `#8b5cf6` | Cor accent, anotacoes |
| Verde | `#22c55e` | Ovulacao, status publicado |
| Azul | `#3b82f6` | Lembretes, dicas |
| Laranja | `#f59e0b` | Janela fertil |

## Notas

- O sistema nao possui autenticacao implementada (prototipo academico)
- Todos os endpoints usam `user_id = 1` hardcoded
- O banco de dados e SQLite (arquivo local, sem necessidade de MySQL/PostgreSQL)