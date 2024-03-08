import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import clean from 'rollup-plugin-delete';
import litScss from '../../libs/lit-scss.js';

export default argv => {
  const isProd = argv.environment === 'production';

  /**
   * @type {import('rollup').RollupOptions}
   */
  return {
    input: `src/index.ts`,
    output: {
      dir: 'custom_components/yandex_player/lovelace',
      format: 'es',
    },
    plugins: [
      clean({ targets: [`custom_components/yandex_player/lovelace/*`] }),
      litScss({
        minify: true,
        options: { loadPaths: ['node_modules'] },
      }),
      resolve({ browser: true }),
      commonjs(),
      typescript({ tsconfig: 'tsconfig.json' }),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      ...(isProd ? [terser()] : []),
      copy({
        hook: 'closeBundle',
        verbose: false,
        targets: [
          {
            src: `src/images/**/*`,
            dest: 'custom_components/yandex_player/lovelace',
          },
        ],
      }),
    ],
  }
}