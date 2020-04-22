import {ZephComponents, html, css, onCreate} from '/node_modules/zephjs/zeph.full.js';
import {search} from '../eventSvc.js';

ZephComponents.define('app-search', () => {
  html('./app-search.html');
  css('./app-search.css');

  onCreate((element, content) => {
    const depressionCheck = content.querySelector('#depression');
    depressionCheck.addEventListener('click', () => {
      search.next('depression');
    });
  });
});