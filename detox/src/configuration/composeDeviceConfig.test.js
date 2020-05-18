describe('composeDeviceConfig', () => {
  let composeDeviceConfig, cliConfig, rawDeviceConfig;

  beforeEach(() => {
    composeDeviceConfig = require('./composeDeviceConfig');
    cliConfig = {};
    rawDeviceConfig = {
      type: 'ios.simulator',
      device: {
        type: 'iPhone X'
      },
    };
  });

  const compose = () => composeDeviceConfig({ cliConfig, rawDeviceConfig });

  describe('validation', () => {
    it('should throw if configuration driver (type) is not defined', () => {
      delete rawDeviceConfig.type;
      expect(compose).toThrowError(/type.*missing.*ios.simulator.*android.emulator/);
    });

    it('should throw if device query is not defined', () => {
      delete rawDeviceConfig.device;
      expect(compose).toThrowError(/device.*empty.*device.*query.*type.*avdName/);
    });
  });

  describe('if a device configuration has the old .name property', () => {
    beforeEach(() => {
      rawDeviceConfig.name = rawDeviceConfig.device;
      delete rawDeviceConfig.device;
    });

    it('should rename it to .device', () => {
      const { type, device, name } = compose();

      expect(type).toBe('ios.simulator');
      expect(name).toBe(undefined);
      expect(device).toEqual({ type: 'iPhone X' });
    });
  });

  describe('if a device configuration has the new .device property', () => {
    beforeEach(() => {
      rawDeviceConfig.device = 'iPhone SE';
    });

    it('should be left intact', () => {
      const { type, device } = compose();

      expect(type).toBe('ios.simulator');
      expect(device).toBe('iPhone SE');
    });

    describe('and there is a CLI override', () => {
      beforeEach(() => {
        cliConfig.deviceName = 'iPad Air';
      });

      it('should be override .device property', () => {
        const { type, device } = compose();

        expect(type).toBe('ios.simulator');
        expect(device).toBe('iPad Air');
      });
    });
  });
});

