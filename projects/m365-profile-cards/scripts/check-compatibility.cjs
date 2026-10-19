const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const id = 'e425e0ca-e11c-45c6-80b2-94c5e6b035ae';
const candidates = ['temp/deploy', 'dist'].map(dir => path.join(dir, id + '.manifest.json'));
const file = candidates.find(candidate => fs.existsSync(candidate));
assert.ok(file, 'Build the production bundle before checking compatibility.');
const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(manifest.id, id);
assert.equal(manifest.version, '1.1.0');
const resources = manifest.loaderConfig.scriptResources;
assert.equal(resources['react-dom'].version, '17.0.1');
assert.equal(resources['@microsoft/sp-http'].version, '1.20.0');
for (const [name, resource] of Object.entries(resources)) {
  if (resource.type === 'component') assert.notEqual(resource.version, '1.23.0', name + ' still requires SPFx 1.23.0');
}
const config = JSON.parse(fs.readFileSync('config/package-solution.json', 'utf8'));
assert.equal(config.solution.version, '1.1.0.0');
console.log('Compatibility passed: unchanged component ID; version 1.1.0; React DOM 17.0.1; SPFx HTTP 1.20.0.');

