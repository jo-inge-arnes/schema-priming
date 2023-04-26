# Client App

Prototype VUE 3 client application. Its Vite development server can be run with
`npm run dev`.

Important! Make sure to create a create a file, `.env.local`, for your local
settings with OpenAI key, organization, temperature, top-p, and GPT model version:

```
VITE_OPENAI_ORG_ID=YOUR_ORG_ID
VITE_OPENAI_API_KEY=YOUR_KEY
VITE_OPENAI_TEMP=0.05
VITE_OPENAI_TOP_P=0.2
VITE_OPENAI_MODEL_VERSION=gpt-4.0 # gpt-3.5-turbo
```

# Other General Information

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

