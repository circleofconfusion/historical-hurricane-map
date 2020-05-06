import { ZephComponents, html, css, onCreate } from 'zephjs';
import { hurricanes } from '../services/eventSvc.js';

ZephComponents.define('app-search-results', () => {
  html('./search-results.html');
  css('./search-results.css');

  onCreate((element, content) => {
    const hurricaneList = content.getElementById('hurricane-list');

    hurricanes.subscribe(hurricanes => {
      hurricaneList.innerHTML = '';

      if (hurricanes.length === 0) {
        content.innerHTML = '<p>No results found</p>';
        return;
      }

      for (let hurricane of hurricanes) {
        const li = document.createElement('li');
        const searchResult = document.createElement('app-text-search-result');
        searchResult.data = hurricane;
        li.appendChild(searchResult);
        hurricaneList.appendChild(li);
      }
    });
  });
});