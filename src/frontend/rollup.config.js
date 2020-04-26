import resolve from '@rollup/plugin-node-resolve';
import zephjsInline from '@rollup/plugin-zephjs-inline';

export default [
  {
    input: 'index.js',
    output: {
      file: 'rolled-up-bundle.js',
      format: 'es',
      name: 'bundle'
    },
    plugins: [ resolve(), zephjsInline({ quiet: false }) ]
  }
];