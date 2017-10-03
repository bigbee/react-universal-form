//currently unused

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
  input: 'examples/example.js',
  output: {
    file: 'examples/bundle.js',
    format: 'iife',
    globals: {
      'recompose': 'Recompose',
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      // babelrc: false,
      // externalHelpers: true,
    }),
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    // }),
    // // commonJS(),
    // resolve({
    //   modules: false,
    // }),
  ],
};
