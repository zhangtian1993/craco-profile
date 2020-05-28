const plugin = require('./index');
const path = require('path');

test('test profile file not found', () => {
  const dir = path.join(process.cwd(), 'test');
  expect(() => {
    plugin.setup(dir, true);
  }).toThrowError(`${path.join(dir, 'profile.js')} not found`);
});

test('test profile[DEV] not found', () => {
  const dir = path.join(process.cwd(), 'test1');
  expect(() => {
    plugin.setup(dir, true);
  }).toThrowError('profile[DEV] not found');
});

test('test loadedProfile is null', () => {
  const data = {};
  expect(() => {
    plugin.overrideWebpackConfig(data);
  }).toThrowError('loadedProfile is null');
});

test('test no DefinePlugin found', () => {
  const data = {
    webpackConfig: {
      plugins: []
    }
  };
  const dir = path.join(process.cwd(), 'test2');
  expect(() => {
    plugin.setup(dir, true);
    plugin.overrideWebpackConfig(data);
  }).toThrowError('no DefinePlugin found');
});

test('test no PUBLIC_URL', () => {
  function DefinePlugin() {
  }

  const data = {
    webpackConfig: {
      plugins: [
        new DefinePlugin(),
      ]
    }
  };
  const dir = path.join(process.cwd(), 'test2');
  plugin.setup(dir, true);
  const webpackConfig = plugin.overrideWebpackConfig(data);

  expect(process.env.PUBLIC_URL)
    .toEqual(undefined);

  expect(webpackConfig.plugins[0].definitions['process.env']['PROFILE'])
    .toEqual('{"NAME":"DEV","TEST":"hello world"}');
});

test('test has PUBLIC_URL', () => {
  function DefinePlugin() {
  }

  const data = {
    webpackConfig: {
      plugins: [
        new DefinePlugin(),
      ]
    }
  };
  const dir = path.join(process.cwd(), 'test3');
  plugin.setup(dir, true);
  const webpackConfig = plugin.overrideWebpackConfig(data);

  expect(process.env.PUBLIC_URL)
    .toEqual('/test');

  expect(webpackConfig.plugins[0].definitions['process.env']['PROFILE'])
    .toEqual('{"NAME":"DEV","PUBLIC_URL":"/test","TEST":"hello world"}');

  delete process.env.PUBLIC_URL;
});

test('test local profile', () => {
  function DefinePlugin() {
  }

  const data = {
    webpackConfig: {
      plugins: [
        new DefinePlugin(),
      ]
    }
  };
  const dir = path.join(process.cwd(), 'test4');
  plugin.setup(dir, false);
  const webpackConfig = plugin.overrideWebpackConfig(data);

  expect(process.env.PUBLIC_URL)
    .toEqual(undefined);

  expect(webpackConfig.plugins[0].definitions['process.env']['PROFILE'])
    .toEqual('{"NAME":"DEV","TEST":"321"}');
});

test('test command args', () => {
  function DefinePlugin() {
  }

  const data = {
    webpackConfig: {
      plugins: [
        new DefinePlugin(),
      ]
    }
  };
  const dir = path.join(process.cwd(), 'test5');

  process.argv.push('--profile');
  process.argv.push('QA');

  plugin.setup(dir, true);

  process.argv.pop();
  process.argv.pop();

  const webpackConfig = plugin.overrideWebpackConfig(data);

  expect(process.env.PUBLIC_URL)
    .toEqual(undefined);

  expect(webpackConfig.plugins[0].definitions['process.env']['PROFILE'])
    .toEqual('{"NAME":"QA","TEST":"321"}');
});
