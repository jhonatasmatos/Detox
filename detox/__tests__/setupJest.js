jest.mock('proper-lockfile');

const yargs = require('yargs');
const path = require('path');

function callCli(modulePath, cmd) {
  return new Promise((resolve, reject) => {
    try {
      yargs
        .scriptName('detox')
        .command(require(path.join(__dirname, "../local-cli", modulePath)))
        .exitProcess(false)
        .fail((msg, err) => reject(err || msg))
        .parse(cmd, (err, argv, output) => {
          err ? reject(err) : setImmediate(() => resolve(output));
        });
    } catch (e) {
      reject(e);
    }
  });
}

global.callCli = callCli;
global.IS_RUNNING_DETOX_UNIT_TESTS = true;
