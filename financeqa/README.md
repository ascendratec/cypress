# Finance App

## Descrição

Este é um projeto de aplicação de finanças simples, construído com React e Vite. O objetivo principal deste projeto é servir como base para o curso de automação de testes com Cypress, onde aprenderemos a implementar e executar testes automatizados em uma aplicação web.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta de build rápida para desenvolvimento web moderno.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida.
- **ESLint**: Ferramenta de linting para manter a qualidade do código.
- **PostCSS**: Ferramenta para processamento de CSS.
- **Lucide React**: Biblioteca de ícones para React.

## Instalação

1. Clone este repositório:
   ```
   git clone <url-do-repositório>
   ```

2. Navegue até o diretório do projeto:
   ```
   cd finance-app
   ```

3. Instale as dependências:
   ```
   npm install
   ```

## Uso

### Desenvolvimento

Para executar a aplicação em modo de desenvolvimento com hot reload:

```
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite).

### Build para Produção

Para construir a aplicação para produção:

```
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist`.

### Preview da Build

Para visualizar a versão de produção localmente:

```
npm run preview
```

### Linting

Para verificar e corrigir problemas de código:

```
npm run lint
```

## Estrutura do Projeto

```
finance-app/
├── src/
│   ├── App.jsx          # Componente principal da aplicação
│   ├── main.jsx         # Ponto de entrada da aplicação
│   └── index.css        # Estilos globais
├── index.html           # Arquivo HTML principal
├── vite.config.js       # Configuração do Vite
├── tailwind.config.js   # Configuração do Tailwind CSS
├── postcss.config.js    # Configuração do PostCSS
├── eslint.config.js     # Configuração do ESLint
└── package.json         # Dependências e scripts
```

## Testes com Cypress

Este projeto será utilizado para demonstrar conceitos de automação de testes end-to-end com Cypress. Os testes serão implementados ao longo do curso, cobrindo:

- Configuração inicial do Cypress
- Escrita de testes básicos
- Interação com elementos da UI
- Testes de formulários e navegação
- Boas práticas de teste

## Contribuição

Este projeto é parte de um curso educacional. Para sugestões ou melhorias, sinta-se à vontade para abrir uma issue ou pull request.

## Licença

Este projeto é para fins educacionais e não possui licença específica.
