const _ = require('lodash');
const DetoxConfigError = require('../errors/DetoxConfigError');

function composeDeviceConfig({ rawDeviceConfig, cliConfig }) {
  if (!rawDeviceConfig.type) {
    throwOnEmptyType();
  }

  rawDeviceConfig.device = cliConfig.deviceName || rawDeviceConfig.device || rawDeviceConfig.name;
  delete rawDeviceConfig.name;

  if (_.isEmpty(rawDeviceConfig.device)) {
    throwOnEmptyDevice();
  }

  return rawDeviceConfig;
}

function throwOnEmptyType() {
  throw new DetoxConfigError(`'type' property is missing, should hold the device type to test on (e.g. "ios.simulator" or "android.emulator")`);
}

function throwOnEmptyDevice() {
  throw new DetoxConfigError(`'device' property is empty, should hold the device query to run on (e.g. { "type": "iPhone 11 Pro" }, { "avdName": "Nexus_5X_API_29" })`);
}

module.exports = composeDeviceConfig;
