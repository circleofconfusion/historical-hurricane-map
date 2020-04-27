import { ZephComponents, html, css, onCreate } from 'zephjs';
import { search } from '../services/searchSvc.js';

ZephComponents.define('app-search', () => {
  html('./app-search.html');
  css('./app-search.css');

  onCreate((element, content) => {
    const form = content.querySelector('form');
    form.addEventListener('submit', evt => {
      evt.preventDefault();
      const formData = Array.from(new FormData(form)).filter(d => d[1]);
      search(formData);
    });

  });
});