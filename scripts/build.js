const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Source already includes the ES5 async helpers. Copy it unchanged so builds
// cannot reintroduce generator syntax or replace the configured provider.
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src', 'myfarsi.js'), 'utf8');
new vm.Script(source, { filename: 'src/myfarsi.js' });
fs.mkdirSync(path.join(root, 'providers'), { recursive: true });
fs.writeFileSync(path.join(root, 'providers', 'myfarsi.js'),
  '/* Generated from src/myfarsi.js by npm run build. */\n' + source);
console.log('Built providers/myfarsi.js');
