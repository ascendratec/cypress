# Documentação do Projeto Cypress

## Visão Geral

Este projeto é a base prática do **Curso de Cypress da Ascendra**, criado para estudar testes automatizados end-to-end (E2E) em aplicações web. A suíte contém exemplos de testes de interface, autenticação e upload de arquivos.

## Objetivo

- Aprender a configurar e executar testes com Cypress.
- Validar fluxo de login e navegação em um app de controle financeiro.
- Exercitar ações como preencher formulários, clicar em botões e fazer upload de arquivos.

## Estrutura do Projeto

- `cypress/` - pasta principal de testes do Cypress.
  - `e2e/` - arquivos de especificação `.cy.js` com os testes E2E.
    - `financeqa.cy.js` - testa login, título da aplicação e abertura de modal de nova transação.
    - `upload.cy.js` - testa o upload de arquivo após login.
  - `fixtures/` - dados de teste e arquivos de fixtures.
    - `example.json` - arquivo usado para teste de upload.
  - `support/` - comandos e configuração global do Cypress.
    - `commands.js` - custom commands do Cypress.
    - `e2e.js` - configurações e importações para testes E2E.
- `cypress.config.js` - arquivo de configuração do Cypress.
- `package.json` - metadados do projeto e scripts npm.
- `README.md` - documentação inicial do repositório.

## Pré-requisitos

- Node.js instalado (versão 14 ou superior recomendada).
- npm disponível.
- Aplicação web rodando localmente em `http://localhost:5173/` para os testes funcionarem.

## Instalação

1. Abra o terminal no diretório do projeto.
2. Execute:

```bash
npm install
```

## Scripts Disponíveis

- `npm run cy:open` - abre o Cypress Test Runner em modo interativo.
- `npm test` - executa todos os testes em modo headless com `cypress run`.

## Como Executar os Testes

### Modo Interativo

```bash
npm run cy:open
```

Depois, escolha o arquivo de teste desejado no Cypress UI.

### Modo Headless

```bash
npm test
```

## Testes Implementados

### `financeqa.cy.js`

Este arquivo contém um teste que:

- seta a viewport para `1920x1080`.
- visita `http://localhost:5173/`.
- verifica se a URL contém `localhost:5173/dash`.
- valida se o título da página é `Finance QA`.
- faz login com `admin@finance.app` / `123456`.
- verifica se o botão tem a classe `.btn`.
- abre o modal de nova transação.

### `upload.cy.js`

Este arquivo contém um teste que:

- inicia a aplicação na mesma URL.
- faz login com `admin@finance.app` / `123456`.
- abre o modal de nova transação.
- faz upload de `cypress/fixtures/example.json`.
- verifica se a mensagem `Arquivo atual: example.json` aparece.

## Observações

- Alguns comandos em `financeqa.cy.js` estão comentados e podem ser ativados para testes adicionais de formulário.
- Certifique-se de que a aplicação web esteja disponível em `http://localhost:5173/` antes de rodar os testes.

## Boas Práticas

- Use `data-cy` para selecionar elementos de forma confiável.
- Mantenha dados de teste em `cypress/fixtures`.
- Separe testes por escopo e funcionalidade.
- Use `beforeEach` para preparar estados repetidos, como login.

## Sugestões de Evolução

- Adicionar mais testes de fluxo de criação e edição de transações.
- Implementar validações de erros e mensagens de formulário.
- Configurar `baseUrl` no `cypress.config.js` para evitar repetir a URL.
- Incluir testes em diferentes resoluções de tela e navegadores.
