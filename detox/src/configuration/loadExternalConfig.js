const fs = require('fs-extra');
const path = require('path');
const findUp = require('find-up');

async function locateExternalConfig(cwd) {
  return findUp([
    '.detoxrc.js',
    '.detoxrc.json',
    '.detoxrc',
    'package.json',
  ], { cwd });
}

async function loadConfig(configPath) {
  const config = path.extname(configPath) === '.js'
    ? require(configPath)
    : JSON.parse(await fs.readFile(configPath, 'utf8'));

  return {
    config,
    filepath: configPath,
  };
}

async function loadExternalConfig({ configPath, cwd }) {
  const resolvedConfigPath = configPath || await locateExternalConfig(cwd);

  if (resolvedConfigPath) {
    return loadConfig(resolvedConfigPath);
  }

  return null;
}

module.exports = loadExternalConfig;
