import resolve from '@rollup/plugin-node-resolve';
import zephjsInline from 'rollup-plugin-zephjs-inline';
import copy from 'rollup-plugin-copy';

export default [
  {
    input: 'index.js',
    output: {
      file: '../../dist/frontend/bundle.js',
      format: 'es',
      name: 'bundle'
    },
    plugins: [
      resolve(),
      zephjsInline(),
      copy({
        targets: [
          { src: 'index.html', dest: '../../dist/frontend/' },
          { src: 'global-style.css', dest: '../../dist/frontend/' },
          { src: 'favicon.ico', dest: '../../dist/frontend/'}
        ]
      })
    ]
  }
];