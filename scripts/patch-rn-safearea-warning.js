const fs = require('fs');
const path = require('path');

const target = path.join(
  process.cwd(),
  'node_modules',
  'react-native-css-interop',
  'dist',
  'runtime',
  'components.js'
);

const needle = `(0, api_1.cssInterop)(react_native_1.SafeAreaView, { className: "style" });`;

function run() {
  if (!fs.existsSync(target)) {
    console.log('[postinstall] react-native-css-interop not found, skipping patch.');
    return;
  }

  const original = fs.readFileSync(target, 'utf8');

  if (!original.includes(needle)) {
    console.log('[postinstall] SafeAreaView patch already applied.');
    return;
  }

  const patched = original.replace(`${needle}\n`, '');
  fs.writeFileSync(target, patched, 'utf8');
  console.log('[postinstall] Applied SafeAreaView deprecation patch (react-native-css-interop).');
}

run();
