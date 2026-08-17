const path = require('path');

// Quando o bundling é disparado pelo Gradle (build Android nativo), o
// processo Node roda com CWD em android/ em vez da raiz do projeto. Várias
// dependências (nativewind, react-native-css-interop) assumem process.cwd()
// == raiz do projeto internamente — sem isso ajustado antes de importá-las,
// elas procuram tailwind.config/package.json no lugar errado e quebram.
if (process.cwd() !== __dirname) {
  process.chdir(__dirname);
}

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// configPath precisa ser absoluto: o default do nativewind ("tailwind.config",
// relativo) quebra quando o bundling é disparado pelo Gradle, que roda com
// CWD em android/ em vez da raiz do projeto.
module.exports = withNativeWind(config, {
  input: './src/styles/global.css',
  configPath: path.resolve(__dirname, 'tailwind.config.js'),
})