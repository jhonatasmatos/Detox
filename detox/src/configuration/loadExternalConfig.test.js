const path = require('path');
const os = require('os');

describe('loadExternalConfig', () => {
  const DIR_DETOXRC = path.join(__dirname, '__mocks__/configuration/detoxrc');
  const DIR_PRIORITY = path.join(__dirname, '__mocks__/configuration/priority');

  let loadExternalConfig;

  beforeEach(() => {
    loadExternalConfig = require('./loadExternalConfig');
  });

  it('should implicitly use .detoxrc, even if there is package.json', async () => {
    const { filepath, config } = await loadExternalConfig({ cwd: DIR_PRIORITY });

    expect(filepath).toBe(path.join(DIR_PRIORITY, '.detoxrc'))
    expect(config).toMatchObject({ configurations: expect.anything() });
  });

  it('should return an empty result if a config cannot be implicitly found', async () => {
    const result = await loadExternalConfig({ cwd: os.homedir() });
    expect(result).toBe(null);
  });

  it('should explicitly use the specified config (via env-cli args)', async () => {
    const configPath = path.join(DIR_PRIORITY, 'detox-config.json');
    const { filepath, config } = await loadExternalConfig({ configPath });

    expect(filepath).toBe(configPath)
    expect(config).toMatchObject({ configurations: expect.anything() });
  });

  it('should throw if the explicitly given config is not found', async () => {
    const configPath = path.join(DIR_PRIORITY, 'non-existent.json');

    await expect(loadExternalConfig({ configPath })).rejects.toThrowError(
      /ENOENT: no such file.*non-existent.json/
    );
  });
});
