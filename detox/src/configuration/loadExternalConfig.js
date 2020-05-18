const { cosmiconfig } = require('cosmiconfig');
const explorer = cosmiconfig('detox')

async function loadExternalConfig({ configPath, cwd }) {
  return configPath
    ? await explorer.load(configPath)
    : await explorer.search(cwd);
}

module.exports = loadExternalConfig;
