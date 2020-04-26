import { ZephComponents, html, css, onCreate } from 'zephjs';
import { search } from '../services/searchSvc.js';

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