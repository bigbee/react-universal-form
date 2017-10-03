//currently unused

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/bundle.js',
    format: 'umd',
    name: 'ReactUniversalForm',
    globals: {
      'prop-types': 'PropTypes',
      recompose: 'recompose',
    },
  },
  external: [ 'prop-types', 'recompose' ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      externalHelpers: true,
      presets: [
        [
          'env',
          {
            targets: {
              browsers: ['last 2 versions', 'safari >= 7'],
            },
            modules: false,
          },
        ],
        'stage-0',
        'flow',
      ],
      plugins: [
        'babel-plugin-add-module-exports',
        'babel-plugin-external-helpers',
        'babel-plugin-transform-react-jsx',
      ],
    }),
    commonJS(),
    resolve({
      module: false,
    }),
  ],
};
