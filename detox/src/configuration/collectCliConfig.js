const argparse = require('../utils/argparse');

function collectCliConfig({ argv }) {
  const arg = (key) => argv && argv[key];
  const env = (key) => argparse.getArgValue(key);
  const get = (key) => arg(key) !== undefined ? arg(key) : env(key);

  return {
    artifactsLocation: get('artifacts-location'),
    recordLogs: get('record-logs'),
    takeScreenshots: get('take-screenshots'),
    recordVideos: get('record-videos'),
    recordPerformance: get('record-performance'),
    recordTimeline: get('record-timeline'),
    cleanup: get('cleanup'),
    configPath: get('config-path'),
    configuration: get('configuration'),
    debugSynchronization: get('debug-synchronization'),
    deviceLaunchArgs: get('device-launch-args'),
    deviceName: get('device-name'),
    forceAdbInstall: get('force-adb-install'),
    gpu: get('gpu'),
    headless: get('headless'),
    jestReportSpecs: get('jest-report-specs'),
    keepLockFile: get('keepLockFile'),
    loglevel: get('loglevel'),
    noColor: get('no-color'),
    reuse: get('reuse'),
    runnerConfig: get('runner-config'),
    useCustomLogger: get('use-custom-logger'),
    workers: get('workers'),
  };
}

module.exports = collectCliConfig;
