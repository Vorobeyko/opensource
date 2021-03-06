/* eslint-disable global-require */

'use strict';

// const builtins = require('builtin-modules');
// const nodeResolve = require('rollup-plugin-node-resolve');
// const commonjs = require('rollup-plugin-commonjs');

// const memoizeCachePath = path.join('.cache', 'docs-posthook-memoized');
// const memoizeFN = memoizeFS({ cachePath: memoizeCachePath }).fn;

// function memoize(func) {
//   return async (...args) => {
//     const fn = process.env.JEST_RUNNER_RELOAD_CACHE
//       ? await memoizeFN(func)
//       : func;
//     const res = await fn(...args);
//     return res;
//   };
// }

const presetOptions = {
  react: true,
  typescript: true,
  node: '8.11',
};

module.exports = {
  eslint: {
    // useEslintrc: false,
    // baseConfig: {
    //   extends: '@tunnckocore',
    // },
  },
  docks: {
    verbose: true,
    // NOTE functions passed to a config must be "pure functions",
    // e.g. no variables from outer scope
    postHook: async ({ pkgRoot, jestConfig: { rootDir } }) => {
      const fs = require('fs');
      const path = require('path');

      // eslint-disable-next-line import/no-dynamic-require
      const { cov } = require(path.join(rootDir, 'package.json'));

      const pkgDir = path.relative(rootDir, pkgRoot);
      const pkgJsonPath = path.join(pkgRoot, 'package.json');
      const covField = cov[pkgDir];

      // eslint-disable-next-line import/no-dynamic-require
      const pkgJson = require(pkgJsonPath);

      const json = {
        ...pkgJson,
        cov: covField || { color: 'grey' },
      };

      const pkgStr = JSON.stringify(json, null, 2);
      await fs.writeFileSync(pkgJsonPath, `${pkgStr}\n`);

      // eslint-disable-next-line global-require
      const { exec } = require('@tunnckocore/execa');

      await exec('verb', { cwd: pkgRoot });
    },
  },

  babel: [
    {
      config: {
        presets: [['@tunnckocore/babel-preset', presetOptions]],
        comments: false,
        sourceMaps: true,
      },
      outDir: 'dist/main',
      monorepo: true,
    },
    {
      config: {
        presets: [
          ['@tunnckocore/babel-preset', { ...presetOptions, modules: false }],
        ],
        comments: false,
        sourceMaps: true,
      },
      outDir: 'dist/module',
      monorepo: true,
    },
  ],

  // rollup: 'fooo',
  // rolldown: {
  //   external: builtins,
  //   inlineDynamicImports: true,
  //   experimentalTopLevelAwait: true,
  //   plugins: [
  //     nodeResolve({
  //       preferBuiltins: true,
  //       mainFields: ['module', 'main'],
  //     }),
  //     commonjs({
  //       // extensions,
  //     }),
  //   ],
  //   output: {
  //     format: 'esm',
  //   },
  // },
};
