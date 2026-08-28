# Minha Saude Feminina - API Backend

API REST desenvolvida com Laravel 11 para o sistema de saude feminina. Fornece endpoints para gerenciamento de conteudo, acompanhamento de ciclo menstrual, registro de sintomas e eventos de calendario.

> Para instrucoes de instalacao, consulte o arquivo [SETUP.md](../SETUP.md).

## Banco de Dados

O projeto utiliza SQLite por padrao. O arquivo do banco esta em `database/database.sqlite`.

### Tabelas

| Tabela | Descricao |
|--------|-----------|
| `categories` | Categorias de artigos |
| `tags` | Tags para organizacao |
| `life_phases` | Fases de vida |
| `articles` | Artigos de saude (published/draft) |
| `article_tag` | Pivot artigos-tags |
| `menstrual_cycles` | Ciclos menstruais (legado) |
| `calendar_events` | Eventos de calendario (menstruation/reminder/note) |
| `symptoms` | Sintomas disponiveis |
| `symptom_logs` | Registros de sintomas |

## Endpoints

### Health Check

```
GET /api/health -> {"status": "ok"}
```

### Eventos de Calendario

```
GET    /api/calendar-events                    # Lista eventos (filtros: start_date, end_date, type, event_date)
POST   /api/calendar-events                    # Criar evento
GET    /api/calendar-events/{id}               # Detalhe do evento
PUT    /api/calendar-events/{id}               # Atualizar evento
DELETE /api/calendar-events/{id}               # Remover evento
POST   /api/calendar-events/toggle-menstruation # Toggle menstruacao para uma data
GET    /api/calendar-events-reminders/upcoming  # Proximos 5 lembretes
```

#### Tipos de evento

- `menstruation` - Dia de menstruacao
- `reminder` - Lembrete (consulta, evento, etc.)
- `note` - Anotacao geral

### Predicoes

```
GET /api/predictions
```

Retorna: fase atual do ciclo, dia do ciclo, proxima menstruacao prevista, janela fertil e duracao media do ciclo. Usa os eventos de `menstruation` como base principal, com fallback para o sistema legado de ciclos.

### Conteudo (CMS)

```
GET    /api/articles                 # Artigos publicados (filtros: category_id, life_phase_id, tag_id)
GET    /api/admin/articles           # Todos os artigos (admin)
POST   /api/admin/articles           # Criar artigo (multipart/form-data)
GET    /api/admin/articles/{id}      # Detalhe
PUT    /api/admin/articles/{id}      # Atualizar
DELETE /api/admin/articles/{id}      # Remover
```

### Categorias, Tags, Fases de Vida

```
GET/POST/PUT/DELETE /api/categories
GET/POST/PUT/DELETE /api/tags
GET/POST/PUT/DELETE /api/life-phases
```

### Sintomas

```
GET    /api/symptoms                 # Lista sintomas disponiveis
GET    /api/symptom-logs             # Logs (filtros: start_date, end_date)
POST   /api/symptom-logs             # Registrar sintoma
PUT    /api/symptom-logs/{id}        # Atualizar
DELETE /api/symptom-logs/{id}        # Remover
```

## CORS

Origens permitidas (configurado em `config/cors.php`):
- `http://localhost:4200` (Admin Angular)
- `http://localhost:8100` (App Ionic)

## Notas

- Nao ha autenticacao implementada - `user_id = 1` e hardcoded em todos os controllers
- Validacao de upload de imagem: max 2MB, tipos aceitos (jpeg, png, gif, webp)
- Artigos suportam imagens de capa armazenadas em `storage/app/public/covers`