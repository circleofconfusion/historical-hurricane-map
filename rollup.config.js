import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'd3-rollup.js',
  output: {
    file: 'd3-exports.js',
    format: 'es',
    name: 'd3-exports'
  },
  plugins: [resolve()]
};