# Guia de Instalação e Execução — Minha Saúde Feminina

## Pré-requisitos

Instale as ferramentas abaixo antes de continuar:

| Ferramenta | Versão | Download | Verificar |
|-----------|--------|----------|-----------|
| Node.js | 20.x LTS | https://nodejs.org/ | `node -v` |
| PHP | 8.2+ | Ver abaixo | `php -v` |
| Composer | 2.x | https://getcomposer.org/download/ | `composer --version` |

### Instalando Node.js

Download do instalador em https://nodejs.org/ (versão LTS). Já inclui o npm.

### Instalando PHP (Windows)

1. Baixar em https://windows.php.net/download/ → VS16 x64 Thread Safe (zip)
2. Extrair em `C:\php`
3. Adicionar `C:\php` ao PATH do sistema (Configurações → Variáveis de Ambiente → Path → Novo)
4. Dentro de `C:\php`, copiar `php.ini-development` para `php.ini`
5. Abrir `php.ini` e remover o `;` do início destas linhas:
   ```
   extension=curl
   extension=fileinfo
   extension=mbstring
   extension=openssl
   extension=pdo_sqlite
   extension=sqlite3
   ```
6. Fechar e reabrir o terminal. Testar com `php -v`

### Instalando PHP (macOS)

```bash
brew install php
```

### Instalando PHP (Linux Ubuntu/Debian)

```bash
sudo apt install php8.2 php8.2-sqlite3 php8.2-mbstring php8.2-curl php8.2-xml
```

### Instalando Composer

- **Windows**: Baixar e executar o instalador `.exe` em https://getcomposer.org/download/
- **macOS/Linux**:
  ```bash
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php composer-setup.php --install-dir=/usr/local/bin --filename=composer
  ```

### Instalando Angular CLI e Ionic CLI

Após instalar Node.js, abrir um terminal e rodar:

```bash
npm install -g @angular/cli @ionic/cli
```

Verificar: `ng version` e `ionic --version`

---

## Primeira Execução (Setup Completo)

Abra 3 terminais separados. Todos os comandos partem da raiz do projeto.

### Terminal 1 — Backend Laravel (porta 8000)

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Aguarde a mensagem `Server running on [http://127.0.0.1:8000]`.

Teste abrindo no navegador: http://localhost:8000/api/health

Resultado esperado: `{"status":"ok"}`

### Terminal 2 — Painel Admin (porta 4200)

```bash
cd admin
npm install
npx ng serve
```

Aguarde a mensagem `Compiled successfully`.

Acesse: http://localhost:4200

### Terminal 3 — App Mobile (porta 8100)

```bash
npm install
npx ionic serve
```

Aguarde a compilação finalizar.

Acesse: http://localhost:8100

---

## Execuções Seguintes (sem instalar novamente)

Após o primeiro setup, basta iniciar os servidores:

### Terminal 1

```bash
cd backend
php artisan serve
```

### Terminal 2

```bash
cd admin
npx ng serve
```

### Terminal 3

```bash
npx ionic serve
```

---

## Resetar o Banco de Dados

Se quiser limpar todos os dados e recriar com os dados de exemplo:

```bash
cd backend
php artisan migrate:fresh --seed
```

---

## Resumo de Portas

| Serviço | URL | Porta |
|---------|-----|-------|
| Backend Laravel API | http://localhost:8000 | 8000 |
| Painel Admin Angular | http://localhost:4200 | 4200 |
| App Mobile Ionic | http://localhost:8100 | 8100 |

O backend precisa estar rodando para o admin e o mobile funcionarem.

---

## Problemas Comuns

| Erro | Solução |
|------|---------|
| `php não é reconhecido como comando` | PHP não está no PATH. Adicione `C:\php` às variáveis de ambiente e reabra o terminal |
| `SQLSTATE: no such table` | Rode `php artisan migrate` dentro de `/backend` |
| `Connection refused` no admin ou mobile | O backend precisa estar rodando (`php artisan serve`) |
| Erro de CORS no navegador | Backend precisa estar na porta 8000 |
| `Module not found` ao rodar ng/ionic serve | Rode `npm install` no diretório correspondente |
| `ng: command not found` | Use `npx ng serve` ao invés de `ng serve`, ou reinstale: `npm install -g @angular/cli` |
| `ionic: command not found` | Use `npx ionic serve` ao invés de `ionic serve`, ou reinstale: `npm install -g @ionic/cli` |

---

## Plano de Limpeza

Para remover tudo que foi instalado para rodar o projeto, sem deletar o código fonte.

### Passo 1 — Remover dependências do projeto

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force admin\node_modules
Remove-Item -Recurse -Force backend\vendor
```

**macOS/Linux:**
```bash
rm -rf node_modules admin/node_modules backend/vendor
```

### Passo 2 — Remover banco de dados local

**Windows:**
```powershell
Remove-Item backend\database\database.sqlite
```

**macOS/Linux:**
```bash
rm backend/database/database.sqlite
```

### Passo 3 — Remover link simbólico do storage

**Windows:**
```powershell
Remove-Item -Force backend\public\storage
```

**macOS/Linux:**
```bash
rm -rf backend/public/storage
```

### Passo 4 — Remover pacotes globais npm (opcional)

```bash
npm uninstall -g @angular/cli @ionic/cli
```

### Passo 5 — Desinstalar ferramentas do sistema (opcional)

**Windows:**
- Node.js: Painel de Controle → Programas → Desinstalar Node.js
- PHP: Deletar `C:\php` e remover do PATH
- Composer: Painel de Controle → Programas → Desinstalar Composer

**macOS:**
```bash
brew uninstall php node
rm /usr/local/bin/composer
```

**Linux:**
```bash
sudo apt remove php8.2 php8.2-sqlite3 php8.2-mbstring php8.2-curl php8.2-xml nodejs
sudo rm /usr/local/bin/composer
```

### Passo 6 — Limpar cache (opcional)

```bash
npm cache clean --force
composer clear-cache
```

---

## Notas

- Última atualização: Features "article-management" e "menstrual-calendar" implementadas.
- O projeto usa SQLite como banco de dados (arquivo local, sem necessidade de MySQL/PostgreSQL).
- Não é necessário configurar variáveis de ambiente adicionais para rodar localmente.
