const path = require('path');
const utils = require('@tunnckocore/utils');

module.exports = (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, alias } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : x.toString()));

  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const { meta: { build = [] } = {} } = require(path.join(
    opts.cwd,
    'package.json',
  ));

  return {
    rootDir: opts.cwd,
    displayName: 'build',
    testMatch: build.map((pkgName) => {
      const source = alias[pkgName];

      return `${source}/**/*.{${exts.join(',')}}`;
    }),
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    ].concat(ignores),
    moduleFileExtensions: exts,
    runner: '@tunnckocore/jest-runner-babel',
  };
};
