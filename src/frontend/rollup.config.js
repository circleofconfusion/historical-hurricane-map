import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'd3-deps.js',
    output: {
      file: 'd3-exports.js',
      format: 'es',
      name: 'd3-exports'
    },
    plugins: [resolve()]
  },
  {
    input: 'rxjs-deps.js',
    output: {
      file: 'rxjs-exports.js',
      format: 'es',
      name: 'rxjs-exports'
    },
    plugins: [resolve()]
  }
];