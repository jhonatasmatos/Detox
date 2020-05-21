const _ = require('lodash');
const path = require('path');

jest.mock('../utils/argparse');

describe('composeDetoxConfig', () => {
  let args;
  let configuration;
  let detoxConfig;
  let deviceConfig;
  let userParams;

  beforeEach(() => {
    args = {};
    detoxConfig = {};
    deviceConfig = {};
    userParams = undefined;

    require('../utils/argparse').getArgValue.mockImplementation(key => args[key]);
    configuration = require('./index');
  });

  describe('composeDetoxConfig', () => {
    it('should throw if no config given', async () => {
      await expect(configuration.composeDetoxConfig({})).rejects.toThrowError(
        /Cannot start Detox without a configuration/
      );
    });

    it('should return a complete Detox config merged with the file configuration', async () => {
      const config = await configuration.composeDetoxConfig({
        cwd: path.join(__dirname, '__mocks__/configuration/detoxrc'),
        argv: {
          configuration: 'another',
          'device-name': 'iPhone XS',
          cleanup: true,
          reuse: true,
          'record-logs': 'all',
        },
        userParams: {
          initGlobals: false,
          launchApp: false,
        },
        override: {
          artifacts: {
            plugins: {
              log: 'none',
              video: 'failing',
            },
          },
          configurations: {
            another: {
              type: 'ios.simulator',
              device: 'iPhone X',
            },
          },
        }
      });

      expect(config).toMatchObject({
        meta: {
          configuration: 'another',
          location: path.join(__dirname, '__mocks__/configuration/detoxrc/.detoxrc.yml'),
        },
        artifactsConfig: {
          plugins: {
            log: {
              enabled: true,
              keepOnlyFailedTestsArtifacts: false,
            },
            video: {
              enabled: true,
              keepOnlyFailedTestsArtifacts: true,
            },
          },
        },
        behaviorConfig: {
          init: {
            exposeGlobals: false,
            launchApp: false,
            reinstallApp: false,
          },
          cleanup: {
            shutdownDevice: true,
          }
        },
        deviceConfig: expect.objectContaining({
          type: 'ios.simulator',
          device: 'iPhone XS',
        }),
        sessionConfig: expect.objectContaining({
          server: 'ws://localhost:9999',
          sessionId: 'external file works',
        }),
      });
    });
  });
});

describe('throwOnEmptyBinaryPath', () => {
  it('should throw an error', () => {
    const { throwOnEmptyBinaryPath } = require('./index');
    expect(throwOnEmptyBinaryPath).toThrowError(/binaryPath.*missing/);
  });
});
