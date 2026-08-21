// moment não publica declarações de tipo para seus arquivos de locale individuais
// (ex.: 'moment/locale/pt-br'), então o TypeScript não consegue resolver o import
// de efeito colateral usado para carregar o locale em runtime.
declare module 'moment/locale/pt-br';
