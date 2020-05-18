const _ = require('lodash');
const DetoxConfigError = require('../errors/DetoxConfigError');
const DetoxRuntimeError = require('../errors/DetoxRuntimeError');
const collectCliConfig = require('./collectCliConfig');
const loadExternalConfig = require('./loadExternalConfig');
const composeArtifactsConfig = require('./composeArtifactsConfig');
const composeBehaviorConfig = require('./composeBehaviorConfig');
const composeDeviceConfig = require('./composeDeviceConfig');
const composeSessionConfig = require('./composeSessionConfig');
const selectConfiguration = require('./selectConfiguration');

async function composeDetoxConfig({
  cwd,
  argv,
  override,
  userParams,
}) {
  const cliConfig = collectCliConfig({ argv });
  const cosmiResult = await loadExternalConfig({
    configPath: cliConfig.configPath,
    cwd,
  });

  const externalConfig = cosmiResult && cosmiResult.config;
  const detoxConfig = _.merge({}, externalConfig, override);

  if (_.isEmpty(detoxConfig)) {
    throw new DetoxRuntimeError({
      message: 'Cannot start Detox without a configuration',
      hint: 'Make sure your package.json has "detox" section, or there\'s .detoxrc file in the working directory',
    });
  }

  const deviceConfigName  = selectConfiguration({
    detoxConfig,
    cliConfig,
  });

  const deviceConfig = composeDeviceConfig({
    cliConfig,
    rawDeviceConfig: detoxConfig.configurations[deviceConfigName],
  });

  const artifactsConfig = composeArtifactsConfig({
    cliConfig,
    configurationName: deviceConfigName,
    detoxConfig,
    deviceConfig,
  });

  const behaviorConfig = composeBehaviorConfig({
    cliConfig,
    detoxConfig,
    deviceConfig,
    userParams,
  });

  const sessionConfig = await composeSessionConfig({
    detoxConfig,
    deviceConfig,
  });

  return {
    artifactsConfig,
    behaviorConfig,
    deviceConfig,
    sessionConfig,
  };
}

module.exports = {
  composeDetoxConfig,

  throwOnEmptyBinaryPath() {
    throw new DetoxConfigError(`'binaryPath' property is missing, should hold the app binary path`);
  },
};
